require "rails_helper"

RSpec.describe "Factory smoke test" do
  it "creates a workout session tree" do
    user = create(:user)
    program = create(:program)
    session = create(:workout_session, user: user, program: program)

    expect(session).to be_persisted
    expect(session.user).to eq(user)
  end
end