# frozen_string_literal: true

class AgentsController < ApplicationController
  def index
    @agents = Agent.order(:name)

    render json: @agents
  end

  def show
    @agent = Agent.find(params[:id])

    render json: @agent
  end

  def create
    @agent = Agent.new(agent_params)

    if @agent.save
      render json: @agent, status: :created
    else
      render json: { errors: @agent.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def agent_params
    params.require(:agent).permit(:name, :accepting_leads)
  end
end
