function runGenerateDocFromSheet(){
  GENERATE_HTML_FROM_SHEET("INPUT_SHEET_ID","OUTPUT_DOC_NAME");
}

function getConfig(){
    
    var CONFIG_TYPE = 1
    var show_title = "PERMALINK-REPLACE"
    var site_name = "brainsmuggler.com"
    var dev_site_name = "dailyplanetpost.com"
    var new_site_name = ""
    var shutterstock_images = false 
    
    var IMAGE_PATH=""
    var IMAGE_EXT=".jpg"
    var ANCHOR_PATH=""
    
    if (CONFIG_TYPE==1){
      ANCHOR_PATH = "http://"+dev_site_name+"/slideshows/"+show_title+"/"
      IMAGE_PATH="http://"+dev_site_name+"/wp-content/uploads/2016/07/"
    }else if (CONFIG_TYPE==2){
      ANCHOR_PATH = "http://"+site_name+"/slideshows/"+show_title+"/"
      IMAGE_PATH="http://"+dev_site_name+"/wp-content/uploads/2016/07/"
    }else if (CONFIG_TYPE==3){
      ANCHOR_PATH = "http://"+site_name+"/slideshows/"+show_title+"/"
      IMAGE_PATH="http://"+site_name+"/wp-content/uploads/2016/07/shutterstock_"
    }else if (CONFIG_TYPE==4){
      ANCHOR_PATH = "http://"+new_site_name+"/slideshows/"+show_title+"/"
      IMAGE_PATH="http://"+new_site_name+"/wp-content/uploads/2016/07/shutterstock_"
    }
    
    return {
      IMAGE_BASE_URL:IMAGE_PATH,
      ANCHOR_BASE_URL:ANCHOR_PATH,
      IMAGE_EXTENSION:IMAGE_EXT
    }
  }

function GENERATE_HTML_FROM_SHEET(sheetId,docName){
  var ss = SpreadsheetApp.openById(sheetId).getSheets()[0];
  var lastRow = ss.getLastRow();
  var lastColumn = ss.getLastColumn();
  var values = ss.getRange(2, 1, lastRow,lastColumn).getValues();
  var content = ""
  for(var i=0;i<lastRow;i++)
  {
    if(values[i][2]){
      content += GENERATE_SLIDE(values[i][0],values[i][1],values[i][2],values[i][3],values[i][4]);
    }
  }
  Logger.log(content)
  GENERATE_DOC(docName,content)
}

function GENERATE_DOC(docName, docData){
doc = DocumentApp.create(docName);
doc.getBody().appendParagraph(docData)
doc.saveAndClose()
Logger.log("generated doc")
}

function GENERATE_SLIDE(slide_num,slide_title,image_name,image_attribution,slide_content){
    if(slide_num == 1)
      return GENERATE_HEADER(slide_num,slide_title,image_name,image_attribution,slide_content)
      
    var tt = "[tps_title]"
    var tt_e = "[/tps_title]"
    var np = "<!--nextpage-->"
    var enter = "\n"
    
    var config = getConfig()
    
    var slide_header_content = tt + slide_title + tt_e + enter
    var image_url = config.IMAGE_BASE_URL + image_name + config.IMAGE_EXTENSION
    var image_tag_content = "<img class=\"aligncenter size-single-thumb wp-image-xxxx\" src=\""+image_url+"\" alt=\""+slide_title+"\" width=\"620\" height=\"379\" />"
    var image_anchor = "<a href=\"" +config.ANCHOR_BASE_URL+slide_num +"/\">"
    var slide_image_content =  image_anchor+ enter + image_tag_content + enter + "</a>"
    var slide_image_attribution = "<p class=\"wp-caption-text\">"+image_attribution+"</p>"
    var generated_slide =  slide_header_content + slide_image_content + enter + slide_image_attribution + enter + slide_content + enter + np
    return generated_slide
}
  
  function GENERATE_HEADER(slide_num,slide_title,image_name,image_attribution,slide_content){
    var th = "[tps_header]"
    var th_e = "[/tps_header]" 
    var np = "<!--nextpage-->"
    var enter = "\n"
    var div_h = "<div class=\"begin-slide\">"
    var div_h_e = "</div>"
    var begin_slideshow_btn = "<h3>Begin Slideshow</h3>"
    
    var config = getConfig()
  
    var slide_header_content = th + slide_title + th_e + enter
    var image_url = config.IMAGE_BASE_URL +  image_name + ".jpg"
    var image_tag_content = "<img class=\"aligncenter size-single-thumb wp-image-xxxx\" src=\""+image_url+"\" alt=\""+slide_title+"\" width=\"620\" height=\"379\" />"
    var image_anchor = "<a href=\""+config.ANCHOR_BASE_URL+slide_num+"/\">"
    var slide_image_content =  image_anchor+ enter + image_tag_content + enter + begin_slideshow_btn + enter + "</a>"
    var slide_image_attribution = "<p class=\"wp-caption-text\">"+image_attribution+"</p>"
    var generated_header =  th + enter +div_h+ enter + slide_image_content + enter + slide_image_attribution + enter + div_h_e+ enter + slide_content + enter + th_e + enter
    return generated_header

  }
 
function getSheetData(startRow,startColumn,endRow,endColumn){
 var ss = SpreadsheetApp.getActiveSpreadsheet()
 var sheet = ss.getActiveSheet()
 var values = sheet.getRange(startRow, startColumn, endRow, endColumn).getValues();
  var articleContent = ""
  for (var i=0;i<endRow;i++){
    articleContent += values[i][0]
  }
 return articleContent
}

function saveSheetDataToDoc(docName,startRow,startColumn,endRow,endColumn){
  GENERATE_DOC(docName,getSheetData(startRow,startColumn,endRow,endColumn))
}

function testGENERATE_SLIDE(){
  Logger.log(GENERATE_SLIDE("slide_title",2,"image_name","image_alt", "image_attribution","slide_content"))
}
function testGENERATE_HEADER(){
  Logger.log(GENERATE_SLIDE("begin-slide",1,"image_name","image_alt", "image_attribution","slide_content"))
}

function testSheetToDoc(){
  saveSheetDataToDoc("test",110,8,135,8)
}

function testGetSheetData(){
  Logger.log(getSheetData(1,8,20,8))
}


