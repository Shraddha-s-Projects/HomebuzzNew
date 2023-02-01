import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AgentsService } from './agents.service';
import { AgentVM, Status } from './agents';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthMessageComponent } from 'src/app/modal/auth-message/auth-message.component';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public displayedColumns: string[] = ['Email', 'PhoneNo', 'FirstName', 'LastName', 'UserName', 'CreatedOn', 'Active', 'actions'];
  public agentList: AgentVM[] = [];
  public dataSource = new MatTableDataSource<AgentVM>(this.agentList);
  public filteredValues: AgentVM = new AgentVM();
  public totalSize: number = 0;
  public pageSizeOptions = [50, 100, 200, 250, 500, 1000];
  public pageSize: number = 50;
  public PageNum: number = 1;
  public isLoaded: boolean;
  public editUser: AgentVM = new AgentVM();

  phoneNoFilter = new FormControl();
  firstNameFilter = new FormControl();
  lastNameFilter = new FormControl();
  userNameFilter = new FormControl();
  emailFilter = new FormControl();

  public status: string = "All";
  public statusList: Status[] = [
    { Id: 1, Name: "All", IsActive: null },
    { Id: 2, Name: "Active", IsActive: true },
    { Id: 3, Name: "In active", IsActive: false }
  ];
  public defaultStatus = this.statusList[0];

  public _unsubscribeAll = new Subscription();

  constructor(
    private agentsService: AgentsService,
    private commonService: CommonService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<AgentVM>(this.agentList);
    this.filteredValues.PageSize = 50;
    this.filteredValues.PageNum = 1;
    this.filteredValues.Skip = 0;
    this.getAgents();
    setInterval(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
    this.dataSource.sort = this.sort;
  }

  getAgents() {
    this.isLoaded = false;
    this._unsubscribeAll.add(this.agentsService.getAgentsForAdmin(this.filteredValues).subscribe((res: any) => {
      if (res.Success) {
        this.agentList = res.StateList;
        if (this.agentList.length > 0) {
          this.totalSize = this.agentList[0].TotalCount;
        }
        this.dataSource.data = res.StateList as AgentVM[];
      }
      this.isLoaded = true;
    },
    error => {
      console.log(error);
      if (error.status == 401) {
        this.commonService.toaster("You have not access for admin module. Please login.", false);
        this.commonService.onLogoutOptionClick();
      }
      this.isLoaded = true;
    }));
  }

  handlePage(event) {
    this.PageNum = event.pageIndex + 1;
    this.filteredValues.PageNum = this.PageNum;
    this.filteredValues.PageSize = event.pageSize;
    this.getAgents();
  }

  sortData(event) {
    this.filteredValues.OrderColumnName = event.active;
    this.filteredValues.OrderColumnDir = event.direction;
    this.getAgents();
  }

  handleInput(event, InputName) {
    switch (InputName) {
      case "FirstName":
        if (event.which === 32 && this.firstNameFilter.value.length === 1) {
          this.firstNameFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.firstNameFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["FirstName"] != event.target.value.trim()) {
              this.filteredValues["FirstName"] = event.target.value.trim();
              this.getAgents();
            }
          });
        }
        break;
      case "LastName":
        if (event.which === 32 && this.lastNameFilter.value.length === 1) {
          this.lastNameFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.lastNameFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["LastName"] != event.target.value.trim()) {
              this.filteredValues["LastName"] = event.target.value.trim();
              this.getAgents();
            }
          });
        }
        break;
      case "Email":
        if (event.which === 32 && this.emailFilter.value.length === 1) {
          this.emailFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.emailFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["Email"] != event.target.value.trim()) {
              this.filteredValues["Email"] = event.target.value.trim();
              this.getAgents();
            }
          });
        }
        break;
      case "UserName":
        if (event.which === 32 && this.userNameFilter.value.length === 1) {
          this.userNameFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.userNameFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["UserName"] != event.target.value.trim()) {
              this.filteredValues["UserName"] = event.target.value.trim();
              this.getAgents();
            }
          });
        }
        break;
      case "Phone No":
        if (event.which === 32 && this.phoneNoFilter.value.length === 1) {
          this.phoneNoFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.phoneNoFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["PhoneNo"] != event.target.value.trim()) {
              this.filteredValues["PhoneNo"] = event.target.value.trim();
              this.getAgents();
            }
          });
        }
        break;
      default:
        break;
    }
  }

  onSelectStatus(event) {
    this.status = event.value.Name;
    var isActive = this.statusList.find(t => t.Name == this.status).IsActive;
    if (this.filteredValues.IsActive != isActive) {
      this.filteredValues.IsActive = isActive;
      this.filteredValues.PageNum = 1;
      this.filteredValues.PageSize = 50;
      this.getAgents();
    }
  }

  onEditAgent(element: AgentVM) {
    // this.editUser = JSON.parse(JSON.stringify(element));
    // element.isEdit = true;
  }

  onSaveAgent(element: AgentVM) {
    // this.isLoaded = false;
    // this._unsubscribeAll.add(this.agentsService.updateUser(element).subscribe(res => {
    //   if (res.Success) {
    //     element.isEdit = false;
    //     this.commonService.toaster("Agent updated successfully.", true);
    //     this.getAgents();
    //   } else {
    //     this.commonService.toaster("Something went to wrong.", false);
    //   }
    //   this.isLoaded = true;
    // },
    // error => {
    //   console.log(error);
    //   if (error.status == 401) {
    //     this.commonService.toaster("You have not access for admin module. Please login.", false);
    //     this.commonService.onLogoutOptionClick();
    //   }
    //   this.isLoaded = true;
    // }));
  }

  checkActiveStatus(event, element: AgentVM) {
    // element.IsActive = event.checked;
  }

  onCloseAgent(element: AgentVM) {
    // this.isLoaded = false;
    // let index = this.agentList.findIndex(t => t.UserId == element.UserId);
    // if (index > -1) {
    //   this.agentList[index] = this.editUser;
    //   this.agentList[index].isEdit = false;
    // }
    // this.isLoaded = true;
  }

  onRemoveAgent(element: AgentVM) {
    // const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
    //   width: "400px"
    // });
    // dialogConfirmRef.componentInstance.message =
    //   "<p class='mb-0'> Are you sure you want to remove agent?</p>";
    // dialogConfirmRef.componentInstance.btnText1 = "Yes";
    // dialogConfirmRef.componentInstance.btnText2 = "No";
    // dialogConfirmRef.componentInstance.role = "Admin";
    // dialogConfirmRef.componentInstance.url1 = "yes";

    // dialogConfirmRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.onRemoveUserConfirm(element);
    //   }
    // });
  }

  onRemoveUserConfirm(element: AgentVM) {
    this.isLoaded = false;
    this._unsubscribeAll.add(this.agentsService.removeAgent(element).subscribe(res => {
      if (res.Success) {
        element.isEdit = false;
        let index = this.agentList.findIndex(t => t.UserId == element.UserId);
        if (index > -1) {
          this.agentList.splice(index, 1);
          this.dataSource.paginator = this.paginator;
        }
        this.commonService.toaster("Agent deleted successfully.", true)
      } else {
        this.commonService.toaster("Something went to wrong.", false);
      }
      this.isLoaded = true;
    },
    error => {
      console.log(error);
      if (error.status == 401) {
        this.commonService.toaster("You have not access for admin module. Please login.", false);
        this.commonService.onLogoutOptionClick();
      }
      this.isLoaded = true;
    }));
  }

  ngOnDestroy(): any {
    this._unsubscribeAll.unsubscribe();
  }
}
