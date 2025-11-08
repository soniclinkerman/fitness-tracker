module Types
  class ExerciseType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :default_sets, Integer, null: true
    field :default_reps_min, Integer, null: true
    field :default_reps_max, Integer, null: true
    field :category, Types::Enums::ExerciseCategoryEnum, null: true
  end
end

