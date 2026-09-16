# Run with: bundle exec ruby script/check.rb
require 'jekyll'
require 'cgi'
require 'uri'

ROOT = File.expand_path('..', __dir__)
errors = []

def web_url?(value)
  uri = URI.parse(value.to_s)
  %w[http https].include?(uri.scheme) && !uri.host.to_s.empty?
rescue URI::InvalidURIError
  false
end

publications = YAML.safe_load_file(File.join(ROOT, '_data/publications.yml'))
abort 'Publications must be a nonempty list.' unless publications.is_a?(Array) && !publications.empty?

titles = []
publications.each_with_index do |publication, index|
  label = "Publication #{index + 1}"
  unless publication.is_a?(Hash)
    errors << "#{label}: expected a record."
    next
  end

  title = publication['title']
  errors << "#{label}: missing title." unless title.is_a?(String) && !title.strip.empty?
  errors << "#{label}: duplicate title #{title.inspect}." if titles.include?(title)
  titles << title

  if publication.key?('journal')
    unless publication['journal'].is_a?(String) && !publication['journal'].strip.empty? && publication['year'].is_a?(Integer)
      errors << "#{label}: a journal needs a name and numeric year."
    end
  end

  authors = publication['authors']
  unless authors.is_a?(Array) && !authors.empty? && authors.all? { |name| name.is_a?(String) && !name.strip.empty? }
    errors << "#{label}: authors must be a nonempty list of names."
  end

  %w[links coverage].each do |field|
    next if field == 'coverage' && !publication.key?(field)
    links = publication[field]
    unless links.is_a?(Array) && !links.empty?
      errors << "#{label}: #{field} must be a nonempty list."
      next
    end
    links.each do |link|
      unless link.is_a?(Hash) && link['label'].is_a?(String) && !link['label'].strip.empty? && web_url?(link['url'])
        errors << "#{label}: each #{field} entry needs a label and an HTTP(S) URL."
      end
    end
  end
end

YAML.safe_load_file(File.join(ROOT, '_data/people.yml')).each do |name, url|
  errors << "Invalid author URL for #{name}." unless web_url?(url)
end
abort errors.join("\n") unless errors.empty?

site = Jekyll::Site.new(Jekyll.configuration('source' => ROOT, 'quiet' => true))
site.process
html_files = Dir.glob(File.join(site.dest, '**/*.html'))

html_files.each do |file|
  html = File.read(file).gsub(/<!--.*?-->/m, '')
  label = file.delete_prefix("#{site.dest}/")
  ids = html.scan(/\bid=["']([^"']+)["']/).flatten
  errors << "#{label}: duplicate HTML IDs." unless ids.uniq == ids
  errors << "#{label}: missing page title." unless html.match?(/<title>\s*[^<\s].*?<\/title>/m)

  html.scan(/\b(?:href|src)=["']([^"']+)["']/).flatten.each do |value|
    uri = URI.parse(CGI.unescapeHTML(value))
    next if uri.scheme || uri.host || uri.path.to_s.empty?

    path = URI::DEFAULT_PARSER.unescape(uri.path)
    path = path.delete_prefix(site.baseurl) if path.start_with?("#{site.baseurl}/")
    target = if path.start_with?('/')
               File.join(site.dest, path.delete_prefix('/'))
             else
               File.expand_path(path, File.dirname(file))
             end
    target = File.join(target, 'index.html') if File.directory?(target)
    errors << "#{label}: missing local target #{value}." unless File.file?(target)
  rescue URI::InvalidURIError
    errors << "#{label}: malformed URL #{value.inspect}."
  end
end

%w[vendor docs script _archive Gemfile Gemfile.lock README.md].each do |path|
  errors << "Development file published: #{path}." if File.exist?(File.join(site.dest, path))
end

abort errors.join("\n") unless errors.empty?
puts "Checked #{publications.length} publications and #{html_files.length} pages; local links and assets resolve."
