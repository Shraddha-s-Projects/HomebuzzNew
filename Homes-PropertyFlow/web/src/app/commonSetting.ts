export class commonSetting{
   public static formatedDate(date) {    
        var newdate = new Date(date);
        var ConvertedDate = (newdate.getMonth() + 1) + '/' + newdate.getDate() + '/' + newdate.getFullYear() + ' ' + newdate.getHours() + ':' + newdate.getMinutes() + ':' + newdate.getSeconds();
        return ConvertedDate;
    }

    public static FormatedDateOnly(date) {
        var newdate = new Date(date);
        var ConvertedDate = (newdate.getMonth() + 1) + '/' + newdate.getDate() + '/' + newdate.getFullYear();
        return ConvertedDate;
    }

    public static JWTErrorHandling(error){
        if(error.status == 401)
            location.reload();
    }
}