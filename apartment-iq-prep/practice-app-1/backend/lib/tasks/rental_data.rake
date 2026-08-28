namespace :rental_data do
  desc "Import HUD Fair Market Rent listings for one FMR area into Property " \
       "(usage: rake rental_data:import_hud_fmr[entity_id,year], year optional)"
  task :import_hud_fmr, %i[entity_id year] => :environment do |_task, args|
    entity_id = args[:entity_id]
    abort "Usage: rake rental_data:import_hud_fmr[ENTITY_ID,YEAR]" if entity_id.blank?

    result = RentalDataClients::ImportHudFmrJob.perform_now(entity_id, year: args[:year])
    report_import_result("hud_fmr", result)
  rescue KeyError
    abort "Set HUD_FMR_API_KEY to run this task"
  rescue RentalDataClients::BaseClient::RequestError, RentalDataClients::BaseClient::ConfigurationError => e
    abort "hud_fmr: #{e.message}"
  end

  desc "Import the fake client's hardcoded listings into Property - no API key or network needed " \
       "(usage: rake rental_data:import_fake)"
  task import_fake: :environment do
    result = RentalDataClients::ImportFakeJob.perform_now
    report_import_result("fake", result)
  end

  def report_import_result(source_name, result)
    puts "#{source_name}: created #{result.created_count}, updated #{result.updated_count}, " \
         "failed #{result.failures.size}"

    result.failures.each do |failure|
      puts "  #{failure.listing.external_id}: #{failure.errors.join(', ')}"
    end

    exit(1) unless result.success?
  end
end
