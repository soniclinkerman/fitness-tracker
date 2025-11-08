class Program < ApplicationRecord
  validates :name, presence: true
  has_many :workout_days, -> {order(:day_number)}, dependent: :destroy

  def next_day
    workout_days.order(:day_number).find_by(completed: false)
  end
end
