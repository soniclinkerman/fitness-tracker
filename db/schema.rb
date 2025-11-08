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

ActiveRecord::Schema[8.0].define(version: 2025_11_01_175247) do
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

  create_table "workout_sets", force: :cascade do |t|
    t.bigint "workout_exercise_id", null: false
    t.integer "set_number"
    t.integer "planned_reps"
    t.float "planned_weight"
    t.integer "completed_reps"
    t.float "completed_weight"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "target_reps_min"
    t.integer "target_reps_max"
    t.index ["workout_exercise_id"], name: "index_workout_sets_on_workout_exercise_id"
  end

  add_foreign_key "exercise_logs", "workout_exercises"
  add_foreign_key "workout_days", "programs"
  add_foreign_key "workout_exercises", "exercises"
  add_foreign_key "workout_sets", "workout_exercises"
end
