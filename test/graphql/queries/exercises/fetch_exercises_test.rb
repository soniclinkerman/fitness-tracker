require "test_helper"

class FetchExercisesTest < ActionDispatch::IntegrationTest
  def setup
    @bench = Exercise.create!(name: "Bench Press", category: :chest)
    @squat = Exercise.create!(name: "Squat", category: :legs)
    @pullup = Exercise.create!(name: "Pull Up", category: :back)
  end

  test "fetches all exercises" do
    query = <<~GQL
      query {
        exercises {
          id
          name
          category
        }
      }
    GQL

    post "/graphql", params: { query: query }
    json = JSON.parse(response.body)

    data = json.dig("data", "exercises")
    errors = json["errors"]

    assert_response :success
    assert_nil errors
    assert_equal 3, data.count

    names = data.map { |e| e["name"] }
    assert_includes names, "Bench Press"
    assert_includes names, "Squat"
    assert_includes names, "Pull Up"
  end

  test "fetches exercises by category" do
    query = <<~GQL
      query {
        exercises(category: CHEST) {
          name
          category
        }
      }
    GQL

    post "/graphql", params: { query: query }
    json = JSON.parse(response.body)

    data = json.dig("data", "exercises")
    errors = json["errors"]

    assert_response :success
    assert_nil errors
    assert_equal 1, data.count
    assert_equal "Bench Press", data.first["name"]
    assert_equal "CHEST", data.first["category"]
  end

  test "fetches exercises by name substring (case-insensitive)" do
    query = <<~GQL
      query {
        exercises(nameContains: "press") {
          name
          category
        }
      }
    GQL

    post "/graphql", params: { query: query }
    json = JSON.parse(response.body)

    data = json.dig("data", "exercises")
    errors = json["errors"]

    assert_response :success
    assert_nil errors
    assert_equal 1, data.count
    assert_equal "Bench Press", data.first["name"]
  end

  test "returns an empty list when no matches found" do
    query = <<~GQL
      query {
        exercises(nameContains: "xyz") {
          name
        }
      }
    GQL

    post "/graphql", params: { query: query }
    json = JSON.parse(response.body)

    data = json.dig("data", "exercises")
    errors = json["errors"]

    assert_response :success
    assert_nil errors
    assert_equal [], data
  end

  test "fetches by ID" do
    query = <<~GQL
      query {
        exercises(id: #{@squat.id}) {
          id
          name
          category
        }
      }
    GQL

    post "/graphql", params: { query: query }
    json = JSON.parse(response.body)

    data = json.dig("data", "exercises")
    errors = json["errors"]

    assert_response :success
    assert_nil errors
    assert_equal 1, data.count
    assert_equal "Squat", data.first["name"]
  end
end
