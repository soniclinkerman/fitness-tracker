require "rails_helper"

RSpec.describe "StartWorkoutSession", type: :graphql do
  let(:user) { create(:user) }
  let(:program) { create(:program, user: user) }

  let(:query) do
    <<~GQL
      mutation {
  startWorkoutSession(input: {}) {
    workoutSession {
      id
      startedAt
      completedAt
    }
  }
}
    GQL
  end


  context "when user has an active program and no active workout session" do
    before do
      user.update!(active_program_id: program.id)
      create(:workout_day, program: program)
    end

    it "creates a workout session" do
      result = execute_graphql(
        query,
        context: { current_user: user }
      )

      expect(result["errors"]).to be_nil
      expect(WorkoutSession.count).to eq(1)
    end
  end

  context "when user has no active program" do
    it "returns an error" do
      result = execute_graphql(
        query,
        context: { current_user: user }
      )

      expect(result["errors"].first["message"])
        .to include("No active program")
    end
  end

  context "when program has no workout days" do
    before do
      user.update!(active_program_id: program.id)
    end

    it "returns an error" do
      result = execute_graphql(
        query,
        context: { current_user: user }
      )

      expect(result["errors"].first["message"])
        .to include("Workout day not found")
    end
  end

  context "when a user already has an active workout session" do
    before do
      user.update!(active_program_id: program.id)
      create(:workout_day, program: program)
      create(:workout_session, user:user,program: program)
    end

    it "returns an error" do
      result = execute_graphql(
        query,
        context: { current_user: user }
      )

      expect(result["errors"].first["message"])
        .to include("Active workout session already exists")
    end
  end

  context "when workout day has exercises and sets" do
    it "creates workout day session and set sessions" do
      user.update!(active_program_id: program.id)
      workout_day = create(:workout_day, program: program)
      exercise = create(:exercise)
      workout_exercise = create(:workout_exercise, workout_day: workout_day, exercise: exercise)
      create_list(:workout_set, 3, workout_exercise: workout_exercise)

      result = execute_graphql(query, context: { current_user: user })

      session = WorkoutSession.last

      expect(session.workout_day_session).to be_present
      expect(
        WorkoutSetSession.where(workout_day_session: session.workout_day_session).count
      ).to eq(3)

      orders = WorkoutSetSession.order(:order).pluck(:order)
      expect(orders).to eq([1, 2, 3])
    end
  end

end