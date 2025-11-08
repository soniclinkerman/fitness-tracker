require "test_helper"

class DeleteExerciseTest < ActionDispatch::IntegrationTest
  def setup
    @exercise = Exercise.create!(
      name: "Bench Press",
      default_sets: 3,
      default_reps_min: 8,
      default_reps_max: 12,
      category: :chest
    )
  end

  test "deletes an exercise successfully" do
    mutation = <<~GQL
      mutation {
        deleteExercise(input: { id: #{@exercise.id} }) {
          exercise {
            id
            name
            category
          }
        }
      }
    GQL

    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)

    data = json.dig("data", "deleteExercise", "exercise")
    errors = json["errors"]

    assert_response :success
    assert_nil errors

    assert_equal @exercise.id.to_s, data["id"]
    assert_equal "Bench Press", data["name"]

    # Confirm it’s actually deleted
    assert_raises(ActiveRecord::RecordNotFound) { Exercise.find(@exercise.id) }
  end

  test "returns an error when exercise is not found" do
    non_existent_id = 999999

    mutation = <<~GQL
      mutation {
        deleteExercise(input: { id: #{non_existent_id} }) {
          exercise {
            id
            name
          }
        }
      }
    GQL

    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)

    data = json.dig("data", "deleteExercise")
    errors = json["errors"]

    assert_response :success
    assert_nil data
    assert_not_nil errors
    assert_match /Exercise not found/, errors.first["message"]
  end
end
