# frozen_string_literal: true

class LeadsController < ApplicationController
  def index
    @leads = Lead.all

    render json: @leads
  end

  def show
    @lead = Lead.find(params[:id])

    render json: @lead
  end

  def create
    @lead = Lead.new(lead_params)

    if @lead.save
      render json: @lead, status: :created
    else
      render json: { errors: @lead.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def match_agents
    @
  end

  def assign_agent
  end

  private

  def lead_params
    params.require(:lead).permit(:zip_code, :agent_id)
  end
end
