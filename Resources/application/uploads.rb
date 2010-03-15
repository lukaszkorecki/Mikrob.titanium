module HttpClientExtra
  require 'net/http'
  require 'uri'
  class Uploader

    def initialize url, file_path, data
      @url = url
      @data = data
      @file = file_path
    end


    def to_s
      puts @url
      puts @file
      @data.each  {|k,v| puts "#{k} = #{v}"}
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
