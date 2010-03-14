namespace :assets do
  def haml_parse(files)
    files.each do |file|
      `haml #{file} > #{file.sub("haml","html")}`
    end
  end
  def sass_parse(files)
    files.each do |file|
      `sass #{file} > #{file.sub("sass","css")}`
    end
  end

  desc "generate html and css from haml and sass files"
  task :generate do
    # TODO add automatic file discovery, k?
    haml_parse ["Resources/index.haml"]
    sass_parse ["Resources/application.sass"]

  end
end

namespace :application do
  SDK_VERSION = "1.0.0"
  def build_command_linux
    `python ~/.titanium/sdk/linux/#{SDK_VERSION}/tibuild.py -r -a ~/.titanium/sdk/linux/#{SDK_VERSION} .`
  end
  def deploy_linux(destination)
    `python ~/.titanium/sdk/linux/#{SDK_VERSION}/tibuild.py -d #{destination} -a ~/.titanium/sdk/linux/#{SDK_VERSION} .`
  end

  def build_command_osx
    `python "/Library/Application\ Support/Titanium/sdk/osx/#{SDK_VERSION}/tibuild.py" -r -a "/Library/Application\ Support/Titanium/sdk/osx/#{SDK_VERSION}" .`
  end
  def deploy_osx(destination)
    `python "/Library/Application\ Support/Titanium/sdk/osx/#{SDK_VERSION}/tibuild.py" -d #{destination} -a "/Library/Application\ Support/Titanium/sdk/osx/#{SDK_VERSION}" .`
  end

  def sorry
    puts "Sorry - Windows sucks"
    exit
  end

  desc "build application"
  task :build do
    Rake::Task['assets:generate'].invoke
    case RUBY_PLATFORM
      when /darwin/ then build_command_osx
      when /linux/ then build_command_linux
      else sorry
    end
  end

  desc "deploy application"
  task :deploy do
    Rake::Task['assets:generate'].invoke
    target = "~/Desktop/"
    case RUBY_PLATFORM
      when /darwin/ then deploy_osx target
      when /linux/ then deploy_linux target
      else sorry
    end
  end

end

desc "Run in dev mode"
task :run do
  Rake::Task["application:build"].invoke
end

task :default => [:run]
