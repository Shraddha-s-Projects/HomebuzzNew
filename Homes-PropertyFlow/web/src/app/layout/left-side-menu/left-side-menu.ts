export class MenuCategory{
    MenuCategoryId:number;
    MenuCategoryName:string;
    SortOrder:number;
    Isdeleted:boolean;
    DeletedOn:Date;
}

export class MenuCategoryVM{
    MenuCategory:MenuCategory;
    lstMenuItem : Array<MenuItem>
}

export class MenuItem{
    MenuItemId:number;
    MenuCategoryId:number;
    MenuItemName:string;
    IconPath:string;
    URL:string;
    SortOrder:number;
    Isdeleted:boolean;
    DeletedOn:Date;
}

export class MenuItemVM{
    MenuItem:MenuItem;
}

export class MenuItemImages{
    Item: Array<IMenuItemImages> = [];
}

export interface IMenuItemImages{
    File:any;
    MenuItemId:number;
    PreviewUrl:string;
    ImagePath:string;
    Title:string;
}

export class MenuCategoryResult{
   lstMenuCategory: Array<MenuCategory>
}