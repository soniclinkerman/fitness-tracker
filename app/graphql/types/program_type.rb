module Types
  class ProgramType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :days_per_week, Integer, null: false
    field :workout_days, [Types::WorkoutDayType], null: true

    field :move_to_next_day, Types::WorkoutDayType, null: true

    def move_to_next_day
      object.next_day
    end
  end
end