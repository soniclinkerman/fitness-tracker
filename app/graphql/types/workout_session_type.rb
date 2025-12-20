module Types
  class WorkoutSessionType < Types::BaseObject
    field :id, ID, null: false
    field :workout_day_session, WorkoutDaySessionType, null: true
    field :started_at, GraphQL::Types::ISO8601DateTime, null: false
    field :completed_at, GraphQL::Types::ISO8601DateTime,null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime,null: true
  end
end