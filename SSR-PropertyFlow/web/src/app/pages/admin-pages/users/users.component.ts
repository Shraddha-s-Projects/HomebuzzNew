import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { UsersService } from './users.service';
import { UserVM, Status } from './user';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToasterConfig } from 'angular2-toaster';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthMessageComponent } from 'src/app/modal/auth-message/auth-message.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });

  public displayedColumns: string[] = ['Email', 'PhoneNo', 'FirstName', 'LastName', 'UserName', 'CreatedOn', 'Active', 'actions'];
  public userList: UserVM[] = [];
  // public dataSource = new MatTableDataSource(ELEMENT_DATA);
  public dataSource = new MatTableDataSource<UserVM>(this.userList);
  public filteredValues: UserVM = new UserVM();
  public totalSize: number = 0;
  public pageSizeOptions = [50, 100, 200, 250, 500, 1000];
  public pageSize: number = 50;
  public PageNum: number = 1;
  public isLoaded: boolean;
  public editUser: UserVM = new UserVM();
  public status: string = "All";
  public statusList: Status[] = [
    { Id: 1, Name: "All", IsActive: null },
    { Id: 2, Name: "Active", IsActive: true },
    { Id: 3, Name: "In active", IsActive: false }
  ];
  public defaultStatus = this.statusList[0];
  phoneNoFilter = new FormControl();
  firstNameFilter = new FormControl();
  lastNameFilter = new FormControl();
  userNameFilter = new FormControl();
  emailFilter = new FormControl();

  public _unsubscribeAll = new Subscription();

  constructor(
    private usersService: UsersService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<UserVM>(this.userList);
    this.filteredValues.PageSize = 50;
    this.filteredValues.PageNum = 1;
    this.filteredValues.IsActive = null;
    this.filteredValues.Skip = 0;
    this.getUsers();
    setInterval(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
    this.dataSource.sort = this.sort;
  }

  getUsers() {
    this.isLoaded = false;
    this._unsubscribeAll.add(this.usersService.getUsersForAdmin(this.filteredValues).subscribe((res: any) => {
      if (res.Success) {
        this.userList = res.StateList;
        if (this.userList.length > 0) {
          this.totalSize = this.userList[0].TotalCount;
        }
        this.dataSource.data = res.StateList as UserVM[];
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
    this.getUsers();
  }

  sortData(event) {
    this.filteredValues.OrderColumnName = event.active;
    this.filteredValues.OrderColumnDir = event.direction;
    this.getUsers();
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
              this.getUsers();
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
              this.getUsers();
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
              this.getUsers();
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
              this.getUsers();
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
              this.getUsers();
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
      this.getUsers();
    }
  }

  onEditUser(element: UserVM) {
    this.editUser = JSON.parse(JSON.stringify(element));
    element.isEdit = true;
  }

  onSaveUser(element: UserVM) {
    this.isLoaded = false;
    this._unsubscribeAll.add(this.usersService.updateUser(element).subscribe(res => {
      if (res.Success) {
        element.isEdit = false;
        this.getUsers();
        this.commonService.toaster("User updated successfully.", true)
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

  checkActiveStatus(event, element: UserVM) {
    element.IsActive = event.checked;
  }

  onCloseUser(element: UserVM) {
    this.isLoaded = false;
    let index = this.userList.findIndex(t => t.UserId == element.UserId);
    if (index > -1) {
      this.userList[index] = this.editUser;
      this.userList[index].isEdit = false;
    }
    this.isLoaded = true;
  }

  onRemoveUser(element: UserVM) {
    const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
      width: "400px"
    });
    dialogConfirmRef.componentInstance.message =
      "<p class='mb-0'> Are you sure you want to remove user?</p>";
    dialogConfirmRef.componentInstance.btnText1 = "Yes";
    dialogConfirmRef.componentInstance.btnText2 = "No";
    dialogConfirmRef.componentInstance.role = "Admin";
    dialogConfirmRef.componentInstance.url1 = "yes";

    dialogConfirmRef.afterClosed().subscribe(result => {
      if (result) {
        this.onRemoveUserConfirm(element);
      }
    });
  }

  onRemoveUserConfirm(element: UserVM) {
    this.isLoaded = false;
    this._unsubscribeAll.add(this.usersService.removeUser(element).subscribe(res => {
      if (res.Success) {
        element.isEdit = false;
        let index = this.userList.findIndex(t => t.UserId == element.UserId);
        if (index > -1) {
          this.userList.splice(index, 1);
          this.dataSource.paginator = this.paginator;
        }
        this.commonService.toaster("User deleted successfully.", true)
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

const ELEMENT_DATA: UserVM[] = [
  {
    UserId: 1,
    Email: 'shraddha111@gmail.com',
    PhoneNo: '1111111111',
    FirstName: 'aaaaa',
    LastName: 'aaaaa',
    UserName: 'aaaaa',
    Role: 'Admin',
    RoleId: 1,
    CreatedOn: '03-07-2020',
    OrderColumnName: '',
    OrderColumnDir: '',
    PageNum: 1,
    PageSize: 50,
    IsActive: true,
    Skip: 0,
    TotalCount: 10,
    isEdit: true
  },
  {
    UserId: 2,
    Email: 'shraddha111@gmail.com',
    PhoneNo: '1111111111',
    FirstName: 'aaaaa',
    LastName: 'aaaaa',
    UserName: 'aaaaa',
    Role: 'Admin',
    RoleId: 1,
    CreatedOn: '03-07-2020',
    OrderColumnName: '',
    OrderColumnDir: '',
    PageNum: 1,
    PageSize: 50,
    IsActive: true,
    Skip: 0,
    TotalCount: 10,
    isEdit: false
  },
  {
    UserId: 3,
    Email: 'shraddha111@gmail.com',
    PhoneNo: '1111111111',
    FirstName: 'aaaaa',
    LastName: 'aaaaa',
    UserName: 'aaaaa',
    Role: 'Admin',
    RoleId: 1,
    CreatedOn: '03-07-2020',
    OrderColumnName: '',
    OrderColumnDir: '',
    PageNum: 1,
    PageSize: 50,
    IsActive: true,
    Skip: 0,
    TotalCount: 10,
    isEdit: true
  }
] 