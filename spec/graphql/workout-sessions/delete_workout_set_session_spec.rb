# frozen_string_literal: true

require "rails_helper"

RSpec.describe 'DeleteWorkoutSetSession', type: :graphql do
  let(:user) { create(:user) }
  let(:program) { create(:program, user: user) }
  let(:workout_session) { create(:workout_session, user:, program:) }



  let(:workout_day_session) { create(:workout_day_session, workout_session:) }
  let(:exercise) { create(:exercise) }
  let(:workout_exercise) { create(:session_workout_exercise, workout_session:, exercise: exercise) }

  let!(:set1) { create(:workout_set_session, workout_exercise:, workout_day_session:, order: 1, user:, exercise:exercise ) }
  let!(:set2) { create(:workout_set_session, workout_exercise:, workout_day_session:, order: 2, user:, exercise: exercise) }
  let!(:set3) { create(:workout_set_session, workout_exercise:, workout_day_session:, order: 3, user:, exercise: exercise) }


  let(:query) do
    <<~GQL
         mutation DeleteWorkoutSetSession($id: ID!){
        deleteWorkoutSetSession(input:{id: $id})
        {
          workoutSets{
            id
            completedReps
            completedWeight
            isFailure
            order
          }
        }
      }
    GQL
  end

  context 'when a user deletes a set from an exercise' do

    it 're-orders correctly' do
      expect(workout_session.workout_day_session.workout_set_sessions.count).to eq(3)
      result = execute_graphql(
        query,
        variables: { id: set2.id },
        context: { current_user: user }
      )


      expect(result["errors"]).to be_nil
      expect(workout_session.reload.workout_day_session.workout_set_sessions.count).to eq(2)
      ids = workout_session
              .reload
              .workout_day_session
              .workout_set_sessions
              .pluck(:id)

      expect(ids).to match_array([set1.id, set3.id])
      returned_orders = result
                          .dig("data", "deleteWorkoutSetSession", "workoutSets")
                          .map { |s| s["order"] }

      expect(returned_orders).to eq([1, 2])

    end

  end

  context 'when a user deletes a set from a completed session' do
    let!(:completed_session) do
      create(
        :workout_session,
        user: user,
        program: program,
        completed_at: Time.current
      )
    end

    let!(:completed_day_session) do
      create(:workout_day_session, workout_session: completed_session)
    end

    let!(:completed_exercise) do
      create(
        :session_workout_exercise,
        workout_session: completed_session,
        exercise: exercise
      )
    end

    let!(:completed_set) do
      create(
        :workout_set_session,
        workout_exercise: completed_exercise,
        workout_day_session: completed_day_session,
        order: 1,
        user: user,
        exercise: exercise
      )
    end

    it 'prevents deletion' do
      result = execute_graphql(
        query,
        variables: { id: completed_set.id },
        context: { current_user: user }
      )

      expect(result["errors"].first["message"])
        .to include("Set does not belong to active workout session")
    end
  end
end
