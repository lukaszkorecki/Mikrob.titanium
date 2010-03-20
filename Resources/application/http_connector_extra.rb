class HttpConnectorExtraUploader
  def initialize url,user
    @url = url
    @user = user
    if `curl` =~ /command not found/
      return false
    end
  end
  def upload data
    headers = {
      "X-blip-api" => "0.02",
      "Accept" => "application/json",
      "User-Agent" => "Mikrob 0.1"
    }
    header_string = headers.map{|k,v| "-H'#{k}: #{v}'"}.join " "
    data_string = %{-F "update[body]=#{data[:body]}" -F"update[picture]=@#{data[:file]}"}
    user_string = %{-u #{@user[:login]}:#{@user[:password]}}
    out= `curl #{header_string} #{user_string} #{data_string} #{@url}`
    puts out
    if out =~ /#{data[:body]}/
      return true
    else
      return false
    end

  end

end

class HttpConnectorExtraDownloader
  require 'net/http'
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

