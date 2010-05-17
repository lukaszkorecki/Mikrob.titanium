function super_upload(user, pass, body, file) {
  var filename="teeth.jpg";
  var url = "http://api.blip.pl/updates";
  var boundary = '----1g42345568790';
  var header =  "--" + boundary + "\r\n" + "Content-Disposition: form-data; name=\"update[body]\"\r\n\r\n" + body + "\r\n";
  header += "--" + boundary + "\r\n";
  header += "Content-Disposition: form-data; update[picture]=\"" + filename + "\";";
  header += "filename=\"" + filename + "\"\r\n";
  header += "Content-Type: application/octet-stream\r\n\r\n";

  var userDir = Titanium.Filesystem.getUserDirectory();
  console.log(userDir);
  var uploadFile = Titanium.Filesystem.getFile(userDir, 'teeth.jpg');
  console.log(uploadFile);
  var uploadStream = Titanium.Filesystem.getFileStream(uploadFile);

  uploadStream.open(Titanium.Filesystem.FILESTREAM_MODE_READ);
  content = uploadStream.read();
  uploadStream.close();

  var fullContent = header + content + "\r\n--" + boundary + "--";
  console.log(fullContent);
  var xhr = Titanium.Network.createHTTPClient(); 
  xhr.open("POST",url);
  xhr.onreadystatechange=function(e){
    console.dir(e);
  };
  xhr.setRequestHeader("Content-type", "multipart/form-data; boundary=\"" + boundary + "\"");
  xhr.setRequestHeader("X-Blip-Api", "0.02");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Connection", "close");
  xhr.setBasicCredentials(user, pass);
  xhr.send(fullContent);
   
}
function run() {
  super_upload(services[active_service].login, services[active_service].password,">plugawy test");
}
