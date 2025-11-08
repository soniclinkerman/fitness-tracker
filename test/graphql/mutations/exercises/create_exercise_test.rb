require "test_helper"

class CreateExerciseTest < ActionDispatch::IntegrationTest
  test "creates a valid exercise" do
    mutation = <<~GQL
    mutation {
      createExercise(
        input: {
          name: "Bench Press",
          description: "A classic chest exercise",
          category: CHEST
        }
      ) {
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

    exercise_data = json.dig("data", "createExercise", "exercise")
    errors = json["errors"]

    assert_response :success
    assert_nil errors, "Expected no top-level GraphQL errors"
    assert_equal "Bench Press", exercise_data["name"]
    assert_equal "CHEST", exercise_data["category"]
    assert Exercise.find_by(name: "Bench Press")
  end


  test "returns an error when name is missing" do
    mutation = <<~GQL
    mutation {
      createExercise(
        input: {
          description: "A chest exercise with no name",
          category: CHEST
        }
      ) {
        exercise { id name }
      }
    }
  GQL

    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)

    errors = json["errors"]

    assert_response :success
    assert_not_nil errors
    assert_match /Argument 'name'/, errors.first["message"]
  end


  test "creates an exercise with only the required name" do
    mutation = <<~GQL
    mutation {
      createExercise(
        input: {
          name: "Pull Up"
        }
      ) {
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

    exercise_data = json.dig("data", "createExercise", "exercise")
    errors = json.dig("data", "createExercise", "errors")

    assert_response :success
    assert_nil errors
    assert_equal "Pull Up", exercise_data["name"]
    assert_equal "UNCATEGORIZED", exercise_data["category"]
  end

  test "returns an error when default_sets is invalid" do
    mutation = <<~GQL
    mutation {
      createExercise(
        input: {
          name: "Bad Sets",
          defaultSets: -5,
          category: LEGS
        }
      ) {
        exercise {
          id
          name
        }
        errors
      }
    }
  GQL

    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)

    errors = json["errors"]

    assert_response :success
    assert_not_nil errors
    assert errors.any?
  end

  test "returns an error when exercise name already exists" do
    Exercise.create!(name: "Bench Press", category: :chest)

    mutation = <<~GQL
    mutation {
      createExercise(
        input: {
          name: "Bench Press",
          category: CHEST
        }
      ) {
        exercise { id name }
        errors
      }
    }
  GQL

    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)

    errors = json["errors"]

    assert_response :success
    assert_not_nil errors
    assert errors.any?
  end

  test "returns an error when default_sets is negative" do
    mutation = <<~GQL
    mutation {
      createExercise(
        input: {
          name: "Bad Sets",
          defaultSets: -5,
          category: LEGS
        }
      ) {
        exercise { id name }
      }
    }
  GQL

    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)

    errors = json["errors"]

    assert_response :success
    assert_not_nil errors
    assert errors.any?, "Expected at least one GraphQL error"
  end

end
