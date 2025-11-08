module Types
  module Enums
    class ExerciseCategoryEnum < Types::BaseEnum
      # Value expects graphql_name, ruby_value, description
      # We pass the uppercase symbol for graphql, and lowercase string as the ruby value
      Exercise.categories.each do |key, _|
        value key.upcase, value: key, description: "#{key.titleize} exercise"
      end
    end
  end
end
