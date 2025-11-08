module Types
  module Inputs
  class WorkoutSetInputType < Types::BaseInputObject
    argument :id, ID, required: false
    argument :set_number, Integer, required: false
    argument :planned_reps, Integer, required: false
    argument :planned_weight, Float, required: false
    argument :target_reps_min, Integer, required: false
    argument :target_reps_max, Integer, required: false
    argument :completed_reps, Integer, required: false
    argument :completed_weight, Float, required: false
    argument :notes, String, required: false
  end
  end
end