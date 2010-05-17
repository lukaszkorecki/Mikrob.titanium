class HttpConnectorExtraUploader
  require 'cgi'
  require 'net/http'
  require 'base64'
  require 'uri'
  DS = case PLATFORM
         when /(darwin|linux)/ then "/"
         when /win/ then "\\"
         else "/"
       end
  def initialize url,user
    @url = url
    @user = user

  end
  def upload_via_curl data
    headers = {
      "X-blip-api" => "0.02",
      "Accept" => "application/json",
      "User-Agent" => Application.ua_string,
      'X-Blip-Application' => Application.ua_string
    }
    header_string = headers.map{|k,v| "-H'#{k}: #{v}'"}.join " "
    data_string = %{-F "update[body]=#{(data[:data]['update[body]'] || " ")}" -F"update[picture]=@#{data[:files]['update[picture]']}"}
    user_string = %{-u #{@user[:login]}:#{@user[:password]}}
    out= `curl #{header_string} #{user_string} #{data_string} #{@url}`
    puts out
    if out =~ /#{data[:body]}/
      return true
    else
      return false
    end

  end
  #     data = {
  #      :data => {
  #        "update[body]" => ">>plugawy body body body"
  #      },
  #      :files => {
  #        "update[picture]" => "/Users/lukasz/Desktop/Weird/2452.jpg"
  #      }
  #    }

  def upload  data

    params = [].tap do |array|
      data[:files].each{|k,v| array << file_to_multipart(k,v) }
      data[:data].each{|k,v| array << string_to_multipart(k,v) }

    end

    boundary = '349832898984244898448024464570528145'
    query = params.collect {|p| puts p; '--' + boundary + "\r\n" + p}.join('') + "--" + boundary + "--\r\n"
    headers = {
      "Authorization" => "Basic #{Base64.encode64(@user[:login]+":"+@user[:password])}",
      "X-blip-api" => "0.02",
      "Accept" => "application/json",
      "User-Agent" => "Mikrob 0.1",
      "Content-type" => "multipart/form-data; boundary=" + boundary
    }
    post_url = URI.parse(@url)
    http = Net::HTTP.new
    http.set_debug_output $stderr
    http.start(post_url.host, 80) do |con|

      response = con.post2(post_url.path, query, headers)
      puts response
    end
  end
private
  def string_to_multipart name, data
    puts name
    puts data
    return "Content-Disposition: form-data; name=\"#{CGI::escape(name)}\"\r\n\r\n#{data}\r\n"
  end
  def file_to_multipart name, file
    puts name
    puts file
    filename = file.split(DS).last
    content = File.read(file)
    mime_type = "image/"+filename.split(".").last.downcase # :-)
    return "Content-Disposition: form-data; name=\"#{CGI::escape(name)}\"; filename=\"#{filename}\"\r\n" +
         "Content-Transfer-Encoding: binary\r\n" +
         "Content-Type: #{mime_type}\r\n" +
         "\r\n" +
         "#{content}\r\n"
  end
end

