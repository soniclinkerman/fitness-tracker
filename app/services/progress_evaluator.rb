class ProgressEvaluator
  # @param user [User] - the user who completed the exercise
  # @param exercise [Exercise] the exercise being evaluated
  # @param day_session [WorkoutDaySession] - optional, context of the day
  # @return [Hash] result containing status and weight info
  def self.call(user:, exercise:, day_session:)
    increment_value = 5
    # 1. Fetch all completed WorkoutSetSessions for the given exercise and day_session.
    # 2. Identify the corresponding WorkoutExercise and its target WorkoutSets.
    # 3. Evaluate progress by comparing completed reps vs. target min reps.
    # 4. Update or create ExerciseProgress accordingly.
    # 5. Return a hash summary (status, current_weight, next_weight, etc.)
    # Grab the exercise associated with the day
    workout_set_sessions = day_session.workout_set_sessions.where(exercise_id: exercise.id)
    should_progress = did_pass_required_reps(workout_set_sessions)
    current_weight = workout_set_sessions.first.planned_weight
    next_weight = current_weight
    exercise_progress = ExerciseProgress.find_or_create_by(user: user, exercise: exercise)
    if should_progress
      next_weight=current_weight+ increment_value
      exercise_progress.update!(current_weight:, last_completed_reps: workout_set_sessions.last.completed_reps, next_weight:)
    end
    {
      progressed: should_progress,
      next_session_weight: next_weight,
      exercise_progress: exercise_progress,
    }

end

  private
  def did_pass_required_reps(sets)
    sets.each do |set|
      if set.completed_reps < set.target_reps_min
        return false
      end
    end
    true
  end

end