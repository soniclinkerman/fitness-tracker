require 'rails_helper'

Rspec.describe "createExercise mutation", type: :request do
  it "creates an exercise with valid input" do

    mutation = <<~GQL
mutation{
    createExercise(input: {name: "Hello", description:"Yes"})
    {
      exercise{
        id
        name
        defaultSets
        defaultRepsMax
        defaultRepsMin
        category
      }
    }
  }
   
    GQL
    post "/graphql", params: { query: mutation }
    json = JSON.parse(response.body)
    expect(response).to have_http_status(:ok)
    expect(json.dig("data", "createExercise", "exercise", "name")).to eq("Bench Press")

  end
end