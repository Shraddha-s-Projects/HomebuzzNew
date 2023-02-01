import { Component, OnInit, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
    selector: 'main-layout',
    templateUrl: "./main-layout.component.html",
    styleUrls: ["./main-layout.component.css"]
})

export class MainLayoutComponent implements OnInit, AfterViewChecked  {

    public showSearchbox: boolean;
    public pageName: string;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private cd: ChangeDetectorRef) {
        // this.toggleSearchBox();
    }

    ngOnInit() {
        this.toggleSearchBox();
    }

    public toggleSearchBox() {
        let url = this.router.url.split("/");
        let isExist = url[1].includes("property")
        this.pageName = url[1];
        if (this.pageName == "property"){
            this.showSearchbox = true;
        }
        else if (this.router.url == '/property') {
            this.showSearchbox = true;
        } else if(isExist){
            this.showSearchbox = true;
        }
        else {
            this.showSearchbox = false;
        }
    }

    ngAfterViewChecked(){
        this.cd.detectChanges();
      }
}