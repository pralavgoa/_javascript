function testImagePreview(){
  Logger.log(searchQueryTerm("Muhammad Ali",0))
}
function testLicenseImage(){
  Logger.log(licenseImage("329730752","true"))
}

function testImageDownload(){
  downloadImage("IMAGE_URL")
}

function testLicenseImageAndDownload(){
  var ACCESS_TOKEN = ""
  licenceImageAndDownload("329730752", ACCESS_TOKEN)
}

function runLicenseImagesAndDownload(){
  var sheetId = "SHEET_ID"
  var access_token = ""
  
  var ss = SpreadsheetApp.openById(sheetId).getSheets()[0];
  //var lastRow = ss.getLastRow();
  //var lastColumn = ss.getLastColumn();
  var firstRow = 13
  var lastRow = 22
  var column = 7
  
  var values = ss.getRange(firstRow, column, lastRow,column).getValues();
  for(var i=0;i<lastRow;i++)
  {
    var image_id = ""+values[i][0]
    if(image_id){
      Logger.log(image_id)
      licenceImageAndDownload(image_id,access_token)
    }
  }
}

function searchQueryTerm(query_term) {
   var API_URL = 'https://api.shutterstock.com/v2/images/search';  
   var ACCESS_TOKEN = SpreadsheetApp.getActiveSheet().getRange(1, 2).getValue()
   var query = SpreadsheetApp.getActiveSheet().getRange(2, 2).getValue()+query_term
   var headers =
   {
     "Authorization":"Bearer "+ACCESS_TOKEN,
     "Content-Type":"application/json"    
   }
   
   var options =
   {
     "method" : "get",
     "headers" : headers
   };

   var response = UrlFetchApp.fetch(API_URL+query, options);
   
   var responseText = response.getContentText()
   return responseText
 }

function licenceImageAndDownload(image_id, access_token){
  downloadImage(licenseImage(image_id,true, access_token),image_id)
}

function licenseImage(image_id,is_editorial,access_token){
  var API_URL = "https://api.shutterstock.com/v2/images/licenses?subscription_id=SUBSCRIPTION_ID"
  var headers =
  {
     "Authorization":"Bearer "+access_token,
     "Content-Type":"application/json"    
  }
  var payload = "{\"images\" : [{ \"image_id\" : \""+image_id+"\", \"size\": \"medium\", \"editorial_acknowledgement\": "+is_editorial+"}]}"
  
  var options =
   {
     "method" : "post",
     "headers" : headers,
     "payload" : payload
   }
  var response = UrlFetchApp.fetch(API_URL, options);
  return JSON.parse(response.getContentText()).data[0].download.url;
}

function downloadImage(image_url,image_name) {
  var image = UrlFetchApp.fetch(image_url).getBlob();
  file = DriveApp.createFile(image);
}

function getImageUrlFromResponse(responseText,result_number){
  return JSON.parse(responseText).data[result_number].assets.preview.url
}

function getImageIdFromResponse(responseText,result_number){
  return JSON.parse(responseText).data[result_number].id
}
