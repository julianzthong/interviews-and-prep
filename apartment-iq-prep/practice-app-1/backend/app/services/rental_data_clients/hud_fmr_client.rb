module RentalDataClients
  # Pulls Fair Market Rent data from HUD's public FMR API
  # (https://www.huduser.gov/hudapi/public/fmr). Unlike a per-address listing
  # source, HUD publishes one rent figure per bedroom size for a whole FMR
  # area (a metro, county, or non-metro area) - there is no street address or
  # ZIP code in the response. #request_listings unpacks that one area response
  # into one raw record per bedroom size so #parse_listing can stay a simple
  # one-record-to-one-Listing mapping, consistent with every other client.
  #
  # NOTE: the field names below (basicdata, areaname, county_name, state_name,
  # Efficiency/One-Bedroom/etc) reflect our best understanding of HUD's JSON
  # shape from documentation and memory - they have not been verified against
  # a live response. Confirm/adjust once we have a real API token to test
  # with. Because HUD returns no address or ZIP, listings from this client
  # will fail Property's zip_code/address validations as-is until we decide
  # how to bridge area-level data onto an address-shaped model.
  class HudFmrClient < BaseClient
    source_name "hud_fmr"
    base_url "https://www.huduser.gov/hudapi/public/fmr"

    BEDROOM_FIELDS = {
      "Efficiency" => 0,
      "One-Bedroom" => 1,
      "Two-Bedroom" => 2,
      "Three-Bedroom" => 3,
      "Four-Bedroom" => 4
    }.freeze

    private

    # entity_id is a HUD FMR area code (state, county, or CBSA/metro code -
    # e.g. HUD's listStates/listCounties endpoints, not implemented here, are
    # how you'd look one up). year is optional; HUD defaults to the current
    # fiscal year when omitted.
    def request_listings(entity_id:, year: nil)
      response = connection.get("data/#{entity_id}") do |req|
        req.headers["Authorization"] = "Bearer #{api_key}"
        req.params["year"] = year if year
      end

      area = JSON.parse(response.body).fetch("data")
      basic_data = area.fetch("basicdata")

      BEDROOM_FIELDS.map do |field_name, bedrooms|
        {
          "areaname" => area["areaname"],
          "county_name" => area["county_name"],
          "state_name" => area["state_name"],
          "year" => area["year"],
          "bedrooms" => bedrooms,
          "rent" => basic_data[field_name]
        }
      end
    end

    def parse_listing(raw)
      Listing.new(
        source: self.class.source_name,
        external_id: [ raw["areaname"], raw["bedrooms"], raw["year"] ].join("-"),
        address: raw["areaname"],
        city: raw["county_name"],
        state: raw["state_name"],
        zip_code: nil,
        bedrooms: raw["bedrooms"],
        bathrooms: nil,
        rent: raw["rent"],
        available: true,
        listed_at: raw["year"] ? Date.new(raw["year"].to_i, 10, 1) : nil
      )
    end
  end
end
