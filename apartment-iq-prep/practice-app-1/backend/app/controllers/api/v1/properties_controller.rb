module Api
  module V1
    class PropertiesController < ApplicationController
      before_action :set_property, only: %i[show update destroy]

      def index
        scope = Property.all
          .available_filter(params[:available])
          .in_city(params[:city])
          .min_bedrooms(params[:min_bedrooms])
          .max_rent(params[:max_rent])
          .order(created_at: :desc)

        page = [ params[:page].to_i, 1 ].max
        per_page = params[:per_page].present? ? params[:per_page].to_i : 20
        per_page = per_page.clamp(1, 100)

        properties = scope.offset((page - 1) * per_page).limit(per_page)

        render json: {
          properties: properties.as_json,
          meta: {
            page: page,
            per_page: per_page,
            total_count: scope.count,
            total_pages: (scope.count.to_f / per_page).ceil
          }
        }
      end

      def show
        render json: @property
      end

      def create
        property = Property.new(property_params)

        if property.save
          render json: property, status: :created
        else
          render json: { errors: property.errors.full_messages }, status: :unprocessable_content
        end
      end

      def update
        if @property.update(property_params)
          render json: @property
        else
          render json: { errors: @property.errors.full_messages }, status: :unprocessable_content
        end
      end

      def destroy
        @property.destroy
        head :no_content
      end

      private

      def set_property
        @property = Property.find(params[:id])
      end

      def property_params
        params.require(:property).permit(
          :address, :unit, :city, :state, :zip_code,
          :bedrooms, :bathrooms, :square_feet, :rent,
          :available, :listed_at
        )
      end
    end
  end
end
