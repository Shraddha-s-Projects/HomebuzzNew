using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using HomeBuzz.data;
using HomeBuzz.data.Models;
using HomeBuzz.data.Models.ViewModels;
using HomeBuzz.data.Service;
using HomeBuzz.logic.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace HomeBuzz.api.Controllers {
    [Produces ("application/json")]
    [Route ("api/MasterFile")]
    public class MasterFileUploadController : Controller {
        private readonly IMasterFileUploadService _masterFileUploadService;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ITempMasterDataService _tempMasterDataService;
        private ErrorLogService errorlogservice;
        public MasterFileUploadController (
            IMasterFileUploadService masterFileUploadService,
            IHostingEnvironment hostingEnvironment,
            ITempMasterDataService tempMasterDataService,
            HomeBuzzContext context
        ) {
            _masterFileUploadService = masterFileUploadService;
            _hostingEnvironment = hostingEnvironment;
            _tempMasterDataService = tempMasterDataService;
            errorlogservice = new ErrorLogService (context);
        }

        // [Authorize]
        [HttpPost ("UploadFile")]
        [DisableRequestSizeLimit]
        public async Task<OperationResult<List<TempMasterData>>> UploadFile ([FromForm] MasterFileUploadVM Model) {
            try {
                MasterFileUpload masterFileUploadObj = new MasterFileUpload ();
                List<TempMasterData> listTempData = new List<TempMasterData> ();
                DataTable dt = new DataTable ();
                if (Model != null) {
                    if (Model.File == null) throw new Exception ("File is null");
                    if (Model.File.Length == 0) throw new Exception ("File is empty");

                    var folderName = DateTime.Now.ToString ("MMM_yyyy");
                    var dirPath = _hostingEnvironment.WebRootPath + "\\Upload\\MasterFiles\\" + folderName;
                    if (!Directory.Exists (dirPath)) {
                        Directory.CreateDirectory (dirPath);
                    }
                    var fileName = string.Concat (
                        Path.GetFileNameWithoutExtension (Model.File.FileName),
                        DateTime.Now.ToString ("yyyyMMdd_HHmmss"),
                        Path.GetExtension (Model.File.FileName)
                    );
                    var filePath = dirPath + "\\" + fileName;

                    using (var oStream = new FileStream (filePath, FileMode.Create, FileAccess.ReadWrite)) {
                        await Model.File.CopyToAsync (oStream);
                    }

                    masterFileUploadObj.UserId = Model.UserId.Value;
                    masterFileUploadObj.FileName = fileName;
                    masterFileUploadObj.FilePath = filePath;

                    var masterFileUploaded = _masterFileUploadService.CheckInsertOrUpdate (masterFileUploadObj);
                    masterFileUploadObj.Id = masterFileUploaded.Id;

                    // Reference link : 20200610
                    // https://stackoverflow.com/questions/657131/how-to-read-data-of-an-excel-file-using-c
                    // https://stackoverflow.com/questions/14261655/best-fastest-way-to-read-an-excel-sheet-into-a-datatable

                    OleDbCommand cmd = new OleDbCommand ();
                    OleDbDataAdapter da = new OleDbDataAdapter ();
                    DataSet ds = new DataSet ();
                    DataTable dataTable = new DataTable ("PropertyData");
                    dataTable.Columns.Add ("Id", typeof (String));
                    dataTable.Columns.Add ("Address", typeof (String));
                    ds.Tables.Add (dataTable);
                    String strNewPath = filePath;
                    String connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + strNewPath + ";Extended Properties=\"Excel 12.0;HDR=Yes;IMEX=2\"";
                    String query = "SELECT * FROM [Sheet1$]"; // You can use any different queries to get the data from the excel sheet
                    OleDbConnection conn = new OleDbConnection (connString);
                    if (conn.State == ConnectionState.Closed) conn.Open ();
                    using (OleDbCommand comm = new OleDbCommand ()) {
                        comm.CommandText = query;
                        comm.Connection = conn;
                        using (OleDbDataAdapter da1 = new OleDbDataAdapter ()) {
                            da1.SelectCommand = comm;
                            da1.Fill (dt);
                        }
                    }
                }

                for (int i = 0; i < dt.Rows.Count; i++) {
                    TempMasterData masterData = new TempMasterData ();
                    for (int j = 0; j < dt.Columns.Count; j++) {
                        string key = Convert.ToString (dt.Columns[j]);
                        string value = Convert.ToString (dt.Rows[i].ItemArray[j]);
                        switch (key) {
                            // case "ID":
                            //     masterData.Id = Convert.ToInt32 (value);
                            //     break;
                            case "Address":
                                masterData.Address = value;
                                break;
                            case "Suburb/Town":
                                masterData.Suburb = value;
                                break;
                            case "City":
                                masterData.City = value;
                                break;
                            case "PropertyLight Estimate":
                                if (value != "")
                                    masterData.HomebuzzEstimate = Convert.ToDecimal (value);
                                break;
                            case "Bedrooms":
                                masterData.Bedrooms = value;
                                break;
                            case "Bathrooms":
                                masterData.Bathrooms = value;
                                break;
                            case "Garages":
                                masterData.CarSpace = value;
                                break;
                            case "LandArea":
                                masterData.Landarea = value;
                                break;
                            case "LatitudeLongitude":
                                masterData.LatitudeLongitude = value;
                                break;
                            default:
                                break;
                        }
                        //    
                    }
                    // _tempMasterDataService.Add (masterData);
                    if (masterData.LatitudeLongitude != null && masterData.LatitudeLongitude != "" && masterData.LatitudeLongitude != "null") {
                        var latlong = masterData.LatitudeLongitude.Split (",");
                        if (latlong != null) {
                            masterData.Latitude = Convert.ToDecimal (latlong[0]);
                            masterData.Longitude = Convert.ToDecimal (latlong[1]);
                        }
                    }
                    masterData.MasterFileUpload = masterFileUploadObj.Id;
                    listTempData.Add (masterData);
                }
                var list = _tempMasterDataService.InsertTempMasterDataList (listTempData);
                // await _tempMasterDataService.SaveAsync();
                return new OperationResult<List<TempMasterData>> (true, "", listTempData);

            } catch (Exception ex) {
                errorlogservice.LogException (ex);
                return new OperationResult<List<TempMasterData>> (false, CommonMessage.DefaultErrorMessage);
            }
        }
    }
}