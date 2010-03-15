module HttpConnectorExtra
  require 'net/http'
  require 'uri'
  require '../libs/multipart'
  require 'base64'
  class Uploader
    def initialize url,user,  query_data
      @url = url
      @data = query_data
      @user = user
    end

    def upload
      data, headers = Multipart::Post.prepqre_query @data
      headers["X-blip-api"] = "0.02"
      headers["Accept"] = "application/json"
      headers["Authentication"] = "Basic " + @user
      upload_uri = URI.parse(@url)
      http = Net::HTTP.new(upload_uri.host, 80)
      res = http.start {|con| con.post(upload_uri.path, data, headers) }
    end

  end
  class Downloader
    def initialize url, target_name
      @url = URI.parse url
      @target = target_name
    end
    def get
      Net::HTTP.start(@url.host) do |http|
        resp = http.get(@url.path)
        open(@target_name, "wb") do |file|
          file.write(resp.body)
        end
      end
    end
  end
end
