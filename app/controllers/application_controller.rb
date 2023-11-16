class ApplicationController < ActionController::Base
	before_action :configure_permitted_parameters, if: :devise_controller?
	before_action :set_locale


	def default_ulr_options
		{locale: I18n.locale}
	end
	
	private
	def set_locale
		I18n.locale = params[:locale] || I18n.default_locale
	end

	protected

	def configure_permitted_parameters
		devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
		devise_parameter_sanitizer.permit(:account_update, keys: [:username])
	end


end
