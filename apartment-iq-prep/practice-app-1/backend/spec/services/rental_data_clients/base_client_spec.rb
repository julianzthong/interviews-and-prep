require "rails_helper"

module RentalDataClients
  # A minimal concrete client used only to exercise BaseClient's behavior -
  # config validation, the request/normalize template flow, and error wrapping -
  # without depending on any real external source.
  class FakeSourceClient < BaseClient
    source_name "fake_source"
    base_url "https://api.fake-source.test"

    private

    def request_listings(city:)
      response = connection.get("/listings", city: city)
      JSON.parse(response.body)
    end

    def parse_listing(raw)
      Listing.new(
        source: self.class.source_name,
        external_id: raw["id"],
        address: raw["address"],
        city: raw["city"],
        state: raw["state"],
        zip_code: raw["zip"],
        bedrooms: raw["beds"],
        bathrooms: raw["baths"],
        rent: raw["rent"],
        available: raw["is_available"]
      )
    end
  end

  class NoApiKeyClient < BaseClient
    source_name "no_api_key_source"
    base_url "https://api.no-api-key.test"
    requires_api_key false

    private

    def request_listings(**) = []
    def parse_listing(raw) = raw
  end
end

RSpec.describe RentalDataClients::BaseClient do
  describe "configuration validation" do
    it "raises if a subclass has no base_url" do
      client_class = Class.new(described_class) { source_name "missing_base_url" }

      expect { client_class.new(api_key: "key") }.to raise_error(
        RentalDataClients::BaseClient::ConfigurationError, /base_url/
      )
    end

    it "raises if an api key is required but missing" do
      expect { RentalDataClients::FakeSourceClient.new }.to raise_error(
        RentalDataClients::BaseClient::ConfigurationError, /api_key/
      )
    end

    it "allows a subclass to opt out of requiring an api key" do
      expect { RentalDataClients::NoApiKeyClient.new }.not_to raise_error
    end
  end

  describe "#fetch_listings" do
    subject(:client) { RentalDataClients::FakeSourceClient.new(api_key: "test-key") }

    it "requests and normalizes listings into Listing structs" do
      stub_request(:get, "https://api.fake-source.test/listings")
        .with(query: { city: "Austin" })
        .to_return(
          status: 200,
          body: [
            { id: "1", address: "1 Main St", city: "Austin", state: "TX", zip: "78701", beds: 2, baths: 1.5, rent: 2200, is_available: true }
          ].to_json,
          headers: { "Content-Type" => "application/json" }
        )

      listings = client.fetch_listings(city: "Austin")

      expect(listings).to contain_exactly(
        have_attributes(
          source: "fake_source",
          external_id: "1",
          address: "1 Main St",
          city: "Austin",
          rent: 2200,
          available: true
        )
      )
    end

    it "wraps connection failures in a RequestError" do
      stub_request(:get, "https://api.fake-source.test/listings")
        .with(query: { city: "Austin" })
        .to_timeout

      expect { client.fetch_listings(city: "Austin") }.to raise_error(
        RentalDataClients::BaseClient::RequestError, /fake_source request failed/
      )
    end

    it "wraps non-2xx responses in a RequestError" do
      stub_request(:get, "https://api.fake-source.test/listings")
        .with(query: { city: "Austin" })
        .to_return(status: 500, body: "boom")

      expect { client.fetch_listings(city: "Austin") }.to raise_error(
        RentalDataClients::BaseClient::RequestError
      )
    end
  end

  describe "unimplemented hooks" do
    it "raises NotImplementedError from the base class directly" do
      client_class = Class.new(described_class) do
        source_name "raw_base"
        base_url "https://api.raw-base.test"
        requires_api_key false
      end

      expect { client_class.new.fetch_listings }.to raise_error(NotImplementedError)
    end
  end
end
