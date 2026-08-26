# ApartmentIQ Practice App

A small full-stack sandbox for onsite prep: Rails API backend + React (Vite) frontend,
modeled loosely on ApartmentIQ's domain (rental property listings).

## Stack

- **backend/** — Rails 8.1 API-only app, PostgreSQL, RSpec + FactoryBot + Faker, rack-cors
- **frontend/** — React 19 + Vite, plain fetch (no state library), plain CSS

## Domain

One resource: `Property` (address, city/state/zip, bedrooms, bathrooms, square_feet,
rent, available, listed_at) with filtering by city, min bedrooms, max rent, and
availability, plus manual page/per_page pagination.

## Running it

Terminal 1:

```
cd backend
bin/rails db:create db:migrate db:seed   # first time only
bin/rails server                          # http://localhost:3000
```

Terminal 2:

```
cd frontend
npm install     # first time only
npm run dev     # http://localhost:5173
```

Tests: `cd backend && bundle exec rspec`
Lint: `cd backend && bin/rubocop`

## Why this shape

The interview loop (kickoff → independent work → pairing → presentation) suggests they
hand you a spec and watch you build it live with AI assistance. This scaffold exists so
that on the day, the "getting a Rails+React app running and talking to Postgres" tax is
already paid for — the actual exercise is presumably a fresh spec/repo they provide, not
this one. Use this repo beforehand to get fluent with your AI tool of choice (Claude
Code, Codex, etc.) on: adding a model/migration, a new filtered endpoint, a new React
component wired to it, and writing/running specs — the kinds of moves you'll likely be
making live in the 11am–12:30pm independent block and the 12:30pm pairing session.
