module RentalDataClients
  # Persists mapped listings, upserting by (source, external_id) so re-importing
  # the same listing updates the existing Property instead of duplicating it.
  # Uses PropertyMapper for the Listing -> attributes translation but owns all
  # the database decisions (find-or-create, save, tallying results) itself.
  class PropertyImporter
    Result = Struct.new(:created_count, :updated_count, :failures, keyword_init: true) do
      def success?
        failures.empty?
      end
    end

    Failure = Struct.new(:listing, :errors, keyword_init: true)

    def self.call(listings)
      new(listings).call
    end

    def initialize(listings)
      @listings = listings
    end

    def call
      created_count = 0
      updated_count = 0
      failures = []

      listings.each do |listing|
        property = find_or_initialize(listing)
        was_new_record = property.new_record?
        property.assign_attributes(mapped_attributes(listing))

        if property.save
          was_new_record ? created_count += 1 : updated_count += 1
        else
          failures << Failure.new(listing: listing, errors: property.errors.full_messages)
        end
      end

      Result.new(created_count: created_count, updated_count: updated_count, failures: failures)
    end

    private

    attr_reader :listings

    def find_or_initialize(listing)
      Property.find_or_initialize_by(source: listing.source, external_id: listing.external_id)
    end

    def mapped_attributes(listing)
      PropertyMapper.call(listing).attributes.except("id", "created_at", "updated_at")
    end
  end
end
