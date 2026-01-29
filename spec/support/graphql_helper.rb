module GraphqlHelper
  def execute_graphql(query, variables: {}, context: {})
    FitnessTrackerSchema.execute(
      query,
      variables: variables,
      context: context
    )
  end
end