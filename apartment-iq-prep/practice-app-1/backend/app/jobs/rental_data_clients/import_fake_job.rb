module RentalDataClients
  # The unit of work behind `rake rental_data:import_fake` and the
  # `fake_rental_data_import` recurring schedule entry. Returns the
  # PropertyImporter::Result so synchronous callers (like the rake task) can
  # report on it directly; logs a summary itself so a scheduled/background run
  # is still visible without anyone watching it run.
  class ImportFakeJob < ApplicationJob
    queue_as :default

    def perform
      result = PropertyImporter.call(FakeClient.new.fetch_listings)

      Rails.logger.info(
        "RentalDataClients::ImportFakeJob: created=#{result.created_count} " \
        "updated=#{result.updated_count} failed=#{result.failures.size}"
      )
      result.failures.each do |failure|
        Rails.logger.warn("RentalDataClients::ImportFakeJob: #{failure.listing.external_id} failed - #{failure.errors.join(', ')}")
      end

      result
    end
  end
end
