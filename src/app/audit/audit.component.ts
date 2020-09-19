import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit, User } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import { Subject } from 'rxjs';


@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit {
    currentUser: User;
    dateFormat: string = "dd/MM/yyyy hh:mm:ss a";
    dtOptions: DataTables.Settings = {};
    audits = [];
    dtTrigger: Subject<any> = new Subject();
    showTable: boolean;

    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService
    ) {
        this.showTable = false;
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10
        };
        this.loadAllAudits();
    }

    private loadAllAudits() {
        this.auditService.getAll()
            .pipe(first())
            .subscribe(audits => {
                this.audits = audits;
                this.dtTrigger.next();
                setTimeout(() => {
                    this.showTable = true;
                    $(".dataTables_length").append(` | Date Format <select id="dateFormat" (change)="changeDateFormat($event)">
                    <option value='dd/MM/yyyy hh:mm:ss a'>12 Hrs</option>
                    <option value='dd/MM/yyyy HH:mm:ss'>24 Hrs</option>
                </select>`);
                    $("#dateFormat").change(() => {
                        this.dateFormat = $("#dateFormat").val().toString()
                    });
                }, 200);
            });
    }

    toggleTable() {
        return this.showTable ? 'visible' : 'hidden';
    }


    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }
}