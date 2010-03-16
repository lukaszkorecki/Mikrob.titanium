require '../application/http_connector_extra'
data = {
  "update[body]" => ">>plugawy TEST",
  "update[picture]" => File.read("../mikrob_icon.png")
}
user_data ={"login"=>"", "password"=>""}
uploader = HttpConnectorExtra::Uploader.new "http://api.blip.pl/updates", user_data, data
puts uploader.upload
