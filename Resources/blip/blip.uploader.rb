require 'application/http_connector_extra.rb'
def blip_post_file url, login, password, body, file_path
  begin
    data = {
      :data =>{
        "update[body]" => body
      },
      :files => {
        "update[picture]" =>file_path
      }
    }
    con = HttpConnectorExtraUploader.new(url, {:login => login, :password => password})
    con.upload_via_curl(data)
  rescue => err
    console.log err
  end

end
