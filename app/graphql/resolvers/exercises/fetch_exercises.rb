module Resolvers
  module Exercises
    class FetchExercises < GraphQL::Schema::Resolver

      argument :id, ID, required: false
      argument :category, Types::Enums::ExerciseCategoryEnum, required:false
      argument  :name_contains, String, required: false

      type [Types::ExerciseType], null: false

      def resolve(id:nil, category:nil, name_contains:nil)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?
        scope=Exercise.where(user_id:nil).or(Exercise.where(user_id:user.id))
        scope = scope.where(id: id) if id
        scope = scope.where(category: category) if category
        scope = scope.where("name ILIKE ?", "%#{name_contains}%") if name_contains
        scope
      end
    end
  end
end