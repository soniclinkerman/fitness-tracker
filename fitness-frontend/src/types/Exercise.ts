export interface Exercise {
    id: number;
    name: string;
    userId: number;
    description: string;
    category: string;
    defaultSets: number;
    defaultRepsMin: number;
    defaultRepsMax: number;
}