class UnfollowsController < ApplicationController
    before_action :authenticate_user!
  
    def create
      @user = User.find(params[:account_id])
      current_user.unfollow!(@user)
      render json: { status: 'unfollowing', followerCount: @user.follower.count }
    end

  end
  