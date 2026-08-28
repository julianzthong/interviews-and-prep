module RentalDataClients
  # Common configuration and request/normalize flow for clients that pull rental
  # listing data from an external source. Each source gets its own subclass that
  # implements #request_listings (how to call the source) and #parse_listing (how
  # to turn one raw record into a RentalDataClients::Listing). Everything else -
  # connection setup, timeouts, retries, credential checks, error wrapping - lives
  # here so a new source only has to write the source-specific parts.
  class BaseClient
    class ConfigurationError < StandardError; end
    class RequestError < StandardError; end

    class << self
      # Subclasses declare their config via these instead of overriding initialize, e.g.:
      #
      #   class RentometerClient < BaseClient
      #     source_name "rentometer"
      #     base_url "https://api.rentometer.com"
      #   end
      def source_name(value = nil)
        @source_name = value if value
        @source_name || name.demodulize.sub(/Client$/, "").underscore
      end

      def base_url(value = nil)
        @base_url = value if value
        @base_url
      end

      def requires_api_key(value = nil)
        @requires_api_key = value unless value.nil?
        @requires_api_key.nil? ? true : @requires_api_key
      end
    end

    attr_reader :api_key

    def initialize(api_key: nil, timeout: 10, open_timeout: 5)
      @api_key = api_key
      @timeout = timeout
      @open_timeout = open_timeout

      validate_configuration!
    end

    # Template method: fetches raw listings from the source and normalizes each
    # one. Subclasses should not need to override this - implement the two
    # private hooks below instead.
    def fetch_listings(**params)
      request_listings(**params).map { |raw| parse_listing(raw) }
    rescue Faraday::Error => e
      raise RequestError, "#{self.class.source_name} request failed: #{e.message}"
    end

    private

    attr_reader :timeout, :open_timeout

    # NOTE: when base_url has a path component (e.g. ".../hudapi/public/fmr"),
    # request paths passed to connection.get/post must NOT start with "/" -
    # a leading slash makes Faraday's URI join replace the whole path instead
    # of appending to it, silently dropping everything after the host.
    # Use connection.get("data/#{id}"), not connection.get("/data/#{id}").
    def connection
      @connection ||= Faraday.new(url: self.class.base_url) do |conn|
        conn.request :retry, max: 2, interval: 0.5, backoff_factor: 2
        conn.response :raise_error
        conn.options.timeout = timeout
        conn.options.open_timeout = open_timeout
        conn.adapter Faraday.default_adapter
      end
    end

    def validate_configuration!
      if self.class.base_url.blank?
        raise ConfigurationError, "#{self.class} must declare a base_url"
      end

      if self.class.requires_api_key && api_key.blank?
        raise ConfigurationError, "#{self.class} requires an api_key"
      end
    end

    # Subclasses must implement: perform the HTTP call(s) and return an array
    # of raw, source-shaped records (e.g. parsed JSON hashes).
    def request_listings(**_params)
      raise NotImplementedError, "#{self.class} must implement #request_listings"
    end

    # Subclasses must implement: convert one raw record into a Listing.
    def parse_listing(_raw)
      raise NotImplementedError, "#{self.class} must implement #parse_listing"
    end
  end
end
