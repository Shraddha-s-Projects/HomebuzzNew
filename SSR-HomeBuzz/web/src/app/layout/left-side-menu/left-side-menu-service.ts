import { Injectable } from '@angular/core';
import { RouteConfig } from '../../route.config';
import { HttpClientService } from '../../../app/core/services/http-client.service';
import { MenuCategory, MenuItemVM, MenuItem } from './left-side-menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient:HttpClientService, private routeConfig:RouteConfig) { }

  saveCategory(menuCategory:MenuCategory){
    return this.httpClient.authPost("/MenuItem/SaveMenuCategory", menuCategory);
  }

  getAllMenuCategoriesWithItems(){
    return this.httpClient.authGet("/MenuItem/GetMenuCategoriesWithItems");
  }

  deleteMenuCategory(menuCategory:MenuCategory){
    return this.httpClient.authPost("/MenuItem/DeleteMenuCategory", menuCategory);
  }

  saveMenu(menuItemVM:MenuItemVM){
    return this.httpClient.authPost("/MenuItem/SaveMenuItem", menuItemVM);
  }

  savePicture(files:any, menuItemId:number, model: any){
    return this.httpClient.authMultipleFileUpload("/MenuItem/UploadPicture/" + menuItemId, files, model);
  }

  getAllMenuItems(){
    return this.httpClient.authGet("/MenuItem/GetAllMenuItems");
  }

  deleteMenuItem(menuItem:MenuItem){
    return this.httpClient.authPost("/MenuItem/DeleteMenuItem", menuItem);
  }

  GetMenuItemsByByCategory(menuCategoryId:number){
    return this.httpClient.authGet("/MenuItem/GetMenuItemByCategory/" + menuCategoryId);
  }

  removeItemImages(menuItemVM:MenuItemVM){
    return this.httpClient.authPost("/MenuItem/RemoveFile",menuItemVM);
  }
}
