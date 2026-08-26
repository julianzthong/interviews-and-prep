module RentalDataClients
  # The normalized shape every client hands back, regardless of the shape the
  # upstream source uses on the wire. Ingestion code downstream of a client only
  # ever needs to know about this struct, not each source's response format.
  Listing = Struct.new(
    :source,
    :external_id,
    :address,
    :unit,
    :city,
    :state,
    :zip_code,
    :bedrooms,
    :bathrooms,
    :square_feet,
    :rent,
    :available,
    :listed_at,
    keyword_init: true
  )
end
