puts "I require"
require '../application/http_connector_extra'

puts "this is data"
data = {
  "update[body]" => ">>plugawy TEST",
  "update[picture]" => File.read("../mikrob_icon.png")
}




puts "here's the uploader"
uploader = HttpConnectorExtra::Uploader.new "http://api.blip.pl/updates", user_data, data

puts uploader.upload
