import type {WorkoutDay} from "./WorkoutDay.ts";

export interface Program {
    id: number;
    name: string;
    description: string;
    workoutDays: [WorkoutDay]
}