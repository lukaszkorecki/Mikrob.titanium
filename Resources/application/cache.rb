class Cache
  require 'net/http'
  require 'uri'
  require 'fileutils'
  def initialize root
    @ds = File::SEPARATOR
    @root = root+@ds+".mikrob"
  end
  def setup
    FileUtils.mkdir_p @root
    FileUtils.mkdir_p @root+@ds+"av"
    FileUtils.mkdir_p @root+@ds+"img"


  end
  def store url, type, name
    target_name = @root+@ds+type+@ds+name
    from_url = URI.parse url
    Net::HTTP.start(from_url.host) do |http|
      resp = http.get(from_url.path)
      open(target_name, "wb") do |file|
        begin
          file.write(resp.body)
        rescue => err
          return nil
        end
        return target_name
      end
    end
  end
  def check type, file_name
    path = @root + @ds+ type + @ds +file_name
    (FileTest.exists?(path) ? path : nil)
  end
end
