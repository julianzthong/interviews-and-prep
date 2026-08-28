# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_08_26_223248) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "properties", force: :cascade do |t|
    t.string "address", null: false
    t.boolean "available", default: true, null: false
    t.decimal "bathrooms", precision: 3, scale: 1, null: false
    t.integer "bedrooms", null: false
    t.string "city", null: false
    t.datetime "created_at", null: false
    t.string "external_id"
    t.datetime "listed_at"
    t.jsonb "raw_data", default: {}, null: false
    t.decimal "rent", precision: 10, scale: 2, null: false
    t.string "source"
    t.integer "square_feet"
    t.string "state", null: false
    t.string "unit"
    t.datetime "updated_at", null: false
    t.string "zip_code", null: false
    t.index ["available"], name: "index_properties_on_available"
    t.index ["city"], name: "index_properties_on_city"
    t.index ["source", "external_id"], name: "index_properties_on_source_and_external_id", unique: true
    t.index ["zip_code"], name: "index_properties_on_zip_code"
  end
end
