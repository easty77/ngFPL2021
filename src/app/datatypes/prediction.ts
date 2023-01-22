export interface Prediction {
    fixture_id: number;
    predictor_id: string;
    event: number
    team_h_score: number;
    team_a_score: number;
    bonus_score?: number;
    correct_score?: number;
 }