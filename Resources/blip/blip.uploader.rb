require 'application/http_connector_extra.rb'
def blip_post_file url, login, password, body, file_path
  con = HttpConnectorExtraUploader.new(url, {:login => login, :password => password})
  con.upload({:body => body, :file => file_path})

end
