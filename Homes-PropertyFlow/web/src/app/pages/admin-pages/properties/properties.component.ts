import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { PropertyVM, Status } from './properties';
import { PropertiesService } from './properties.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AgentVM } from '../agents/agents';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthMessageComponent } from 'src/app/modal/auth-message/auth-message.component';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // public displayedColumns: string[] = ['actions', 'Address', 'Suburb', 'City', 'HomebuzzEstimate', 'Bedrooms', 'Bathrooms', 'CarSpace', 'Landarea', 'Latitude', 'Longitude'];
  public displayedColumns: string[] = ['Address', 'Suburb', 'City', 'HomebuzzEstimate', 'Bedrooms', 'Bathrooms', 'CarSpace', 'Landarea', 'Latitude', 'Longitude', 'actions'];
  public properties: PropertyVM[] = [];
  public dataSource = new MatTableDataSource<PropertyVM>(this.properties);
  public filteredValues: PropertyVM = new PropertyVM();
  public totalSize: number = 0;
  public pageSizeOptions = [50, 100, 200, 250, 500, 1000];
  public pageSize: number = 50;
  public PageNum: number = 1;
  public isLoaded: boolean;
  public editProperty: PropertyVM = new PropertyVM();

  addressFilter = new FormControl();
  suburbFilter = new FormControl();
  cityFilter = new FormControl();
  bedroomsFilter = new FormControl();
  bathroomsFilter = new FormControl();
  carSpaceFilter = new FormControl();
  landAreaFilter = new FormControl();

  public status: string = "In active";
  public statusList: Status[] = [
    {Id: 1, Name: "In active", IsActive: false},
    {Id: 2, Name: "Active", IsActive: true}
  ];
  public defaultStatus = this.statusList[0];

  public _unsubscribeAll = new Subscription();

  constructor(
    private propertiesService: PropertiesService,
    private commonService: CommonService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<PropertyVM>(this.properties);
    this.filteredValues.PageSize = 50;
    this.filteredValues.PageNum = 1;
    this.getProperties();
    setInterval(() => {
      this.dataSource.sort = this.sort;
    }, 3000);
    this.dataSource.sort = this.sort;
  }

  getProperties() {
    this.isLoaded = false;
    this._unsubscribeAll.add(this.propertiesService.getPropertiesForAdmin(this.filteredValues).subscribe((res: any) => {
      if (res.Success) {
        this.properties = res.StateList;
        if (this.properties.length > 0) {
          this.totalSize = this.properties[0].TotalCount;
        }
        this.dataSource.data = res.StateList as PropertyVM[];
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
    this.getProperties();
  }

  sortData(event) {
    this.filteredValues.OrderColumnName = event.active;
    this.filteredValues.OrderColumnDir = event.direction;
    this.getProperties();
  }

  handleInput(event, InputName) {
    switch (InputName) {
      case "Address":
        if (event.which === 32 && this.addressFilter.value.length === 1) {
          this.addressFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.addressFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["Address"] != event.target.value.trim()) {
              this.filteredValues["Address"] = event.target.value.trim();
              this.getProperties();
            }
          });
        }
        break;
      case "Suburb":
        if (event.which === 32 && this.suburbFilter.value.length === 1) {
          this.suburbFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.suburbFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["Suburb"] != event.target.value.trim()) {
              this.filteredValues["Suburb"] = event.target.value.trim();
              this.getProperties();
            }
          });
        }
        break;
      case "City":
        if (event.which === 32 && this.cityFilter.value.length === 1) {
          this.cityFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.cityFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["City"] != event.target.value.trim()) {
              this.filteredValues["City"] = event.target.value.trim();
              this.getProperties();
            }
          });
        }
        break;
      case "Bedrooms":
        if (event.which === 32 && this.bedroomsFilter.value.length === 1) {
          this.bedroomsFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.bedroomsFilter.valueChanges.debounceTime(500).subscribe((data: any) => {
            if (this.filteredValues["Bedrooms"] != event.target.value.trim()) {
              this.filteredValues["Bedrooms"] = event.target.value.trim();
              this.getProperties();
            }
          });
        }
        break;
      case "Bathrooms":
        if (event.which === 32 && this.bathroomsFilter.value.length === 1) {
          this.bathroomsFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.bathroomsFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["Bathrooms"] != event.target.value.trim()) {
              this.filteredValues["Bathrooms"] = event.target.value.trim();
              this.getProperties();
            }
          });
        }
        break;
      case "CarSpace":
        if (event.which === 32 && this.carSpaceFilter.value.length === 1) {
          this.carSpaceFilter.setValue(null);
          event.preventDefault();
          return false;
        } else {
          this.carSpaceFilter.valueChanges.debounceTime(500).subscribe(data => {
            if (this.filteredValues["CarSpace"] != event.target.value.trim()) {
              this.filteredValues["CarSpace"] = event.target.value.trim();
              this.getProperties();
            }
          });
        }
        break;
        case "Landarea":
          if (event.which === 32 && this.landAreaFilter.value.length === 1) {
            this.landAreaFilter.setValue(null);
            event.preventDefault();
            return false;
          } else {
            this.landAreaFilter.valueChanges.debounceTime(500).subscribe(data => {
              if (this.filteredValues["Landarea"] != event.target.value.trim()) {
                this.filteredValues["Landarea"] = event.target.value.trim();
                this.getProperties();
              }
            });
          }
          break;
      default:
        break;
    }
  }

  onSelectStatus(event){
    this.status = event.value.Name;
    var isActive = this.statusList.find(t => t.Name == this.status).IsActive;
    if(this.filteredValues.IsActive != isActive){
      this.filteredValues.IsActive = isActive;
      this.filteredValues.PageNum = 1;
      this.filteredValues.PageSize = 50;
      this.getProperties();
    }
  }

  onEditProperty(element: PropertyVM) {
    // this.editProperty = JSON.parse(JSON.stringify(element));
    // element.isEdit = true;
  }

  onUpdateProperty(element: PropertyVM) {
    // this.isLoaded = false;
    // this._unsubscribeAll.add(this.propertiesService.updateProperty(element).subscribe(res => {
    //   if (res.Success) {
    //     element.isEdit = false;
    //     this.getProperties();
    //     this.commonService.toaster("Property updated successfully.", true)
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

  onCloseProperty(element: PropertyVM) {
    // this.isLoaded = false;
    // let index = this.properties.findIndex(t => t.Id == element.Id);
    // if (index > -1) {
    //   this.properties[index] = this.editProperty;
    //   this.properties[index].isEdit = false;
    // }
    // this.isLoaded = true;
  }

  onRemoveProperty(element: PropertyVM) {
    // const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
    //   width: "400px"
    // });
    // dialogConfirmRef.componentInstance.message =
    //   "<p class='mb-0'> Are you sure you want to remove property?</p>";
    // dialogConfirmRef.componentInstance.btnText1 = "Yes";
    // dialogConfirmRef.componentInstance.btnText2 = "No";
    // dialogConfirmRef.componentInstance.role = "Admin";
    // dialogConfirmRef.componentInstance.url1 = "yes";

    // dialogConfirmRef.afterClosed().subscribe(result => {
    //   if (result) {
    //    this.onRemovePropertyConfirm(element);
    //   }
    // });
  }

  onRemovePropertyConfirm(element: PropertyVM) {
    this.isLoaded = false;
    this._unsubscribeAll.add(this.propertiesService.removeProperty(element).subscribe(res => {
      if (res.Success) {
        element.isEdit = false;
        let index = this.properties.findIndex(t => t.Id == element.Id);
        if (index > -1) {
          this.properties.splice(index, 1);
          this.dataSource.paginator = this.paginator;
        }
        this.commonService.toaster("Property deleted successfully.", true)
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
