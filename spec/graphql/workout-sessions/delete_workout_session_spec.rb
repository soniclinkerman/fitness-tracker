
require "rails_helper"

RSpec.describe 'DeleteWorkoutSession', type: :graphql do
  let(:user) {create(:user)}
  let!(:workout_session) {create(:workout_session, user:)}

  let(:workout_day_session) { create(:workout_day_session, workout_session:) }
  let(:exercise) { create(:exercise) }
  let(:workout_exercise) { create(:session_workout_exercise, workout_session:, exercise: exercise) }

  let!(:set1) { create(:workout_set_session, workout_exercise:, workout_day_session:, order: 1, user:, exercise:exercise ) }
  let!(:set2) { create(:workout_set_session, workout_exercise:, workout_day_session:, order: 2, user:, exercise: exercise) }
  let!(:set3) { create(:workout_set_session, workout_exercise:, workout_day_session:, order: 3, user:, exercise: exercise) }


  let(:query) do
    <<~GQL
      mutation DeleteWorkoutSession {
        deleteWorkoutSession(input: {}) {
          message
        }
      }
    GQL
  end

  context "When a user deletes an active workout session" do
    it 'deletes all sets' do
      expect(workout_session.workout_day_session.workout_set_sessions.count).to eq(3)
      expect(user.workout_sessions.count).to eq(1)

      expect(user.workout_set_sessions.count).to eq(3)

      result = execute_graphql(
        query,
        context: { current_user: user }
      )

      expect(user.workout_sessions.count).to eq(0)
      expect(user.workout_set_sessions.count).to eq(0)

      expect(result["errors"]).to be_nil
    end

  end

  context "When a user deletes attempts to delete a session that isn't present" do
    let!(:workout_session) {
      create(:workout_session, user:, completed_at:Time.current)
    }

    it 'rejects deletion' do
      result = execute_graphql(
        query,
        context: { current_user: user }
      )

      expect(result["errors"].first['message']).to include 'No active session'
      expect(user.workout_sessions.count).to eq(1)
    end

  end
end