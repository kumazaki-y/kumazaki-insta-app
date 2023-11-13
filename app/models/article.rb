class Article < ApplicationRecord
  belongs_to :user
  has_many_attached :images
  has_many :likes
  has_many :comments, dependent: :destroy

  validate :validate_images_count

  scope :in_last_24_hours, -> { where('articles.created_at > ?', 24.hours.ago) }
  scope :popular, -> { 
    joins(:likes)
    .select('articles.*, COUNT(likes.id) AS likes_count')
    .group('articles.id')
    .order('likes_count DESC')
  }

  private

  def validate_images_count
    if images.count == 0
      errors.add(:base, "少なくとも1枚の画像が必要です")
    elsif images.count > 3
      errors.add(:base, "一度に送信できる画像は3枚までです")
    end
  end
end
