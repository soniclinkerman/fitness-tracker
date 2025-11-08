require "test_helper"

class UpdateExerciseTest < ActionDispatch::IntegrationTest
  def setup
    @exercise = Exercise.create!(
      name: "Bench Press",
      default_sets: 3,
      default_reps_min: 8,
      default_reps_max: 12,
      category: :chest
    )
  end

  test "updates an exercise successfully" do
    mutation = <<~GQL
      mutation {
        updateExercise(
          input: {
            id: #{@exercise.id},
            name: "Incline Bench Press",
            defaultSets: 4
          }
        ) {
          exercise {
            id
            name
            defaultSets
            category
          }
        }
      }
    GQL

    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)

    data = json.dig("data", "updateExercise", "exercise")
    errors = json["errors"]

    assert_response :success
    assert_nil errors

    assert_equal "Incline Bench Press", data["name"]
    assert_equal 4, data["defaultSets"]
    assert_equal "CHEST", data["category"]

    # Verify DB was actually updated
    @exercise.reload
    assert_equal "Incline Bench Press", @exercise.name
    assert_equal 4, @exercise.default_sets
  end

  test "returns an error when updating to a duplicate name" do
    existing = Exercise.create!(
      name: "Shoulder Press",
      default_sets: 3,
      default_reps_min: 8,
      default_reps_max: 12,
      category: :shoulders
    )

    target = Exercise.create!(
      name: "Overhead Press",
      default_sets: 3,
      default_reps_min: 10,
      default_reps_max: 12,
      category: :shoulders
    )

    mutation = <<~GQL
    mutation {
      updateExercise(
        input: {
          id: #{target.id},
          name: "Shoulder Press"
        }
      ) {
        exercise { id name }
      }
    }
  GQL

    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)

    data = json.dig("data", "updateExercise")
    errors = json["errors"]

    assert_response :success
    assert_nil data
    assert_not_nil errors
    assert_match /has already been taken/i, errors.first["message"]

    # Confirm the name was NOT updated
    target.reload
    assert_equal "Overhead Press", target.name
  end

end
