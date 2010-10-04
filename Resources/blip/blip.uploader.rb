require 'libs/mime/types'
require 'libs/rest_client'

def blip_post_file url, login, password, body, file_path
  res = RestClient::Resource.new url, :user => login, :password =>password
  res.post :update => {:body => body, :picture => File.open(file_path)}, :headers => { "User-Agent" => "Mikrob 0.1", 'X-Blip-Api' => '0.02', 'Accept' => 'application/json', 'X-blip-application' => 'Mikrob 0.1'}
end
