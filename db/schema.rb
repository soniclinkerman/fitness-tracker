# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_12_18_044855) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "exercise_logs", force: :cascade do |t|
    t.bigint "workout_exercise_id", null: false
    t.integer "set_number"
    t.integer "reps_done"
    t.string "skip_reason"
    t.integer "weight"
    t.boolean "passed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workout_exercise_id"], name: "index_exercise_logs_on_workout_exercise_id"
  end

  create_table "exercise_progresses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "exercise_id", null: false
    t.decimal "current_weight", precision: 6, scale: 2
    t.decimal "next_weight", precision: 6, scale: 2
    t.integer "last_completed_reps"
    t.decimal "increment_value", precision: 6, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exercise_id"], name: "index_exercise_progresses_on_exercise_id"
    t.index ["user_id", "exercise_id"], name: "index_exercise_progresses_on_user_id_and_exercise_id", unique: true
    t.index ["user_id"], name: "index_exercise_progresses_on_user_id"
  end

  create_table "exercises", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.integer "default_sets"
    t.integer "default_reps_min"
    t.integer "default_reps_max"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "category"
    t.index "lower((name)::text)", name: "index_exercises_on_lower_name", unique: true
  end

  create_table "programs", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.date "start_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "days_per_week"
    t.bigint "user_id"
    t.index ["user_id"], name: "index_programs_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "active_program_id"
    t.index ["active_program_id"], name: "index_users_on_active_program_id"
  end

  create_table "workout_day_sessions", force: :cascade do |t|
    t.bigint "workout_session_id", null: false
    t.bigint "workout_day_id"
    t.integer "position"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workout_day_id"], name: "index_workout_day_sessions_on_workout_day_id"
    t.index ["workout_session_id"], name: "index_workout_day_sessions_on_workout_session_id"
  end

  create_table "workout_days", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "day_number"
    t.bigint "program_id"
    t.boolean "completed", default: false
    t.index ["program_id"], name: "index_workout_days_on_program_id"
  end

  create_table "workout_exercises", force: :cascade do |t|
    t.bigint "exercise_id", null: false
    t.integer "completed_weeks"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "workout_day_id"
    t.index ["exercise_id"], name: "index_workout_exercises_on_exercise_id"
  end

  create_table "workout_sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "program_id"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "completed_at"
    t.datetime "archived_at"
    t.index ["program_id"], name: "index_workout_sessions_on_program_id"
    t.index ["user_id"], name: "index_workout_sessions_on_user_id"
  end

  create_table "workout_set_sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "exercise_id", null: false
    t.bigint "workout_day_session_id"
    t.decimal "completed_weight", precision: 6, scale: 2
    t.integer "completed_reps"
    t.datetime "performed_at", default: -> { "CURRENT_TIMESTAMP" }
    t.text "notes"
    t.boolean "is_failure"
    t.decimal "rpe"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "planned_weight", precision: 6, scale: 2
    t.integer "target_reps_min"
    t.integer "target_reps_max"
    t.integer "workout_exercise_id"
    t.string "exercise_name"
    t.integer "order"
    t.index ["exercise_id"], name: "index_workout_set_sessions_on_exercise_id"
    t.index ["order"], name: "index_workout_set_sessions_on_order"
    t.index ["user_id"], name: "index_workout_set_sessions_on_user_id"
    t.index ["workout_day_session_id"], name: "index_workout_set_sessions_on_workout_day_session_id"
  end

  create_table "workout_sets", force: :cascade do |t|
    t.bigint "workout_exercise_id", null: false
    t.integer "set_number"
    t.integer "planned_reps"
    t.float "planned_weight"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "target_reps_min"
    t.integer "target_reps_max"
    t.index ["workout_exercise_id"], name: "index_workout_sets_on_workout_exercise_id"
  end

  add_foreign_key "exercise_logs", "workout_exercises"
  add_foreign_key "exercise_progresses", "exercises"
  add_foreign_key "exercise_progresses", "users"
  add_foreign_key "programs", "users"
  add_foreign_key "workout_day_sessions", "workout_days"
  add_foreign_key "workout_day_sessions", "workout_sessions"
  add_foreign_key "workout_days", "programs"
  add_foreign_key "workout_exercises", "exercises"
  add_foreign_key "workout_sessions", "programs"
  add_foreign_key "workout_sessions", "users"
  add_foreign_key "workout_set_sessions", "exercises"
  add_foreign_key "workout_set_sessions", "users"
  add_foreign_key "workout_set_sessions", "workout_day_sessions", on_delete: :nullify
  add_foreign_key "workout_sets", "workout_exercises"
end
