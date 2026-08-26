require "rails_helper"

RSpec.describe "Api::V1::Properties", type: :request do
  describe "GET /api/v1/properties" do
    it "returns paginated properties" do
      create_list(:property, 3)

      get "/api/v1/properties"

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["properties"].size).to eq(3)
      expect(body["meta"]).to be_present
    end

    it "filters by city" do
      create(:property, city: "Austin")
      create(:property, city: "Denver")

      get "/api/v1/properties", params: { city: "Austin" }

      body = JSON.parse(response.body)
      expect(body["properties"].size).to eq(1)
      expect(body["properties"].first["city"]).to eq("Austin")
    end
  end

  describe "GET /api/v1/properties/:id" do
    it "returns the property" do
      property = create(:property)

      get "/api/v1/properties/#{property.id}"

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["id"]).to eq(property.id)
    end
  end

  describe "POST /api/v1/properties" do
    it "creates a property with valid params" do
      params = attributes_for(:property)

      expect {
        post "/api/v1/properties", params: { property: params }
      }.to change(Property, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "returns errors with invalid params" do
      post "/api/v1/properties", params: { property: { rent: -5 } }

      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)["errors"]).to be_present
    end
  end

  describe "PATCH /api/v1/properties/:id" do
    it "updates the property" do
      property = create(:property, rent: 1000)

      patch "/api/v1/properties/#{property.id}", params: { property: { rent: 1500 } }

      expect(response).to have_http_status(:ok)
      expect(property.reload.rent).to eq(1500)
    end
  end

  describe "DELETE /api/v1/properties/:id" do
    it "destroys the property" do
      property = create(:property)

      expect {
        delete "/api/v1/properties/#{property.id}"
      }.to change(Property, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
