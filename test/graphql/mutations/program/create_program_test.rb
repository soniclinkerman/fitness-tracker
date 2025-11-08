require 'test_helper'

class CreateProgramTest < ActionDispatch::IntegrationTest
  def setup
    # Any setup needed before each test
  end

  test 'creates a program with a valid days_per_week' do
    mutation = <<-GRAPHQL
      mutation {
        createProgram(input: {
          name: "My Program",
          description: "Test Program Description",
          daysPerWeek: 5
        }) {
          program {
            id
            name
            description
            daysPerWeek
          }
        }
      }
    GRAPHQL

    result = FitnessTrackerSchema.execute(mutation)

    assert_equal "My Program", result['data']['createProgram']['program']['name']
    assert_equal "Test Program Description", result['data']['createProgram']['program']['description']
    assert_equal 5, result['data']['createProgram']['program']['daysPerWeek']
  end

  test 'raises error with invalid days_per_week' do
    mutation = <<-GRAPHQL
      mutation {
        createProgram(input: {
          name: "Invalid Program",
          daysPerWeek: 8
        }) {
          program {
            id
          }
        }
      }
    GRAPHQL

    result = FitnessTrackerSchema.execute(mutation)

    assert_includes result['errors'].first['message'], 'Program can only have up to 7 days per week.'
  end

  test 'creates correct number of workout_days' do
    mutation = <<-GRAPHQL
      mutation {
        createProgram(input: {
          name: "Program with Days",
          daysPerWeek: 4
        }) {
          program {
            id
          }
        }
      }
    GRAPHQL

    result = FitnessTrackerSchema.execute(mutation)
    program_id = result['data']['createProgram']['program']['id']

    # Now, check that 4 workout days are created for this programs
    workout_days = WorkoutDay.where(program_id: program_id)
    assert_equal 4, workout_days.count
  end
end
