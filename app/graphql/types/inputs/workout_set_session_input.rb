module Types
  module Inputs
    class WorkoutSetSessionInput < Types::BaseInputObject
      argument :id, ID, required: true
      argument :completed_reps, Int, required: true
      argument :completed_weight, Float, required: false
      argument :notes, String, required: false
      argument :rpe, Float, required: false
      argument :is_failure, Boolean, required: false
      argument :target_reps_min, Int, required: false
      argument :target_reps_max, Int, required: false
      argument :order, Int, required:true
    end
  end
end