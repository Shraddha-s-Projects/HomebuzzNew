import { Component, Renderer } from '@angular/core';
import { RouteConfig } from "../../route.config";
import { Router } from '@angular/router';
import { MenuItem, MenuCategory } from './left-side-menu';
import { LeftSideMenuService } from './left-side-menu.service';
import { MenuService } from './left-side-menu-service';
import { CommonService } from '../../../app/core/services/common.service';
import { ErrorMessage } from '../../../app/core/services/errormessage.service';

@Component({
  // moduleId: module.id,
  selector: 'app-Menu',
  templateUrl: 'left-side-menu.component.html',
})

export class LeftSideMenuComponent {
  public menuItem: MenuItem;
  public menuCategory: MenuCategory;
  public selectedCategory: MenuCategory;
  public allCategories: MenuCategory[] = [];
  public allMenuItems: MenuItem[] = [];
  public routeConfig: RouteConfig;
  public routeUrl:string;
  public userProfile: any;

  icon: object = {
    isCdnEnable: true,
    cdnUrl: "https://png.icons8.com/"
  }

  constructor(
    private leftSideMenuService: LeftSideMenuService,
    private _routeConfig: RouteConfig,
    private menuItemService: MenuService,
    private commonService: CommonService,
    private errorMessage: ErrorMessage,
    private router:Router
  ) {
    this.routeConfig = _routeConfig;
  }

  ngOnInit() {
    this.menuItem = new MenuItem();
    this.menuCategory = new MenuCategory();
    this.routeUrl = this.router.url;
  }

  getAllMenuCategoriesWithItems() {
    this.menuItemService.getAllMenuCategoriesWithItems().subscribe(
      data => {
        if (data.Success) {
          this.allCategories = data.Model;
        }
      },
      error => {
        this.commonService.toaster(this.errorMessage.error('ErrorOccured'), false);
      },
    )
  }

  selectItem(url:string){
    this.routeUrl = url;
  }
}