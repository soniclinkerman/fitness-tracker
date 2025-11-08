class Exercise < ApplicationRecord
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :default_sets, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :default_reps_min, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :default_reps_max, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true

  enum :category, {
    chest: 0,
    back: 1,
    shoulders: 2,
    biceps: 3,
    triceps: 4,
    legs: 5,
    glutes: 6,
    abs: 7,
    full_body: 8,
    cardio: 9,
    uncategorized: 10,
  }, default: :uncategorized


end
