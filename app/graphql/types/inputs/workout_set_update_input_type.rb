module Types
  module Inputs
    class WorkoutSetUpdateInputType < Types::BaseInputObject
    argument :id, ID, required: true
    argument :completed_reps, Integer, required: true
    argument :completed_weight, Float, required: true
    argument :notes, String, required: false
  end
  end
  end