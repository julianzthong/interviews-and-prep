module RentalDataClients
  # The unit of work behind `rake rental_data:import_hud_fmr` and any
  # `*_hud_fmr_import` recurring schedule entries. Reads the API key from ENV
  # itself (rather than accepting it as an argument) so a real credential
  # never gets serialized into a job's arguments in the solid_queue_jobs
  # table. Raises (via HudFmrClient/ENV.fetch) on connection/config problems
  # so Solid Queue records the job as failed; per-listing validation failures
  # are not fatal and only show up in the returned Result and the logs.
  class ImportHudFmrJob < ApplicationJob
    queue_as :default

    def perform(entity_id, year: nil)
      api_key = ENV.fetch("HUD_FMR_API_KEY")
      client = HudFmrClient.new(api_key: api_key)
      result = PropertyImporter.call(client.fetch_listings(entity_id: entity_id, year: year))

      Rails.logger.info(
        "RentalDataClients::ImportHudFmrJob[#{entity_id}]: created=#{result.created_count} " \
        "updated=#{result.updated_count} failed=#{result.failures.size}"
      )
      result.failures.each do |failure|
        Rails.logger.warn("RentalDataClients::ImportHudFmrJob[#{entity_id}]: #{failure.listing.external_id} failed - #{failure.errors.join(', ')}")
      end

      result
    end
  end
end
