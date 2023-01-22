import { Prediction } from "./prediction";

export interface Fixture {
    id: number;
    code: number;
    event?: number;
    finished: boolean;
    finished_provisional: boolean;
    kickoff_time? : Date;
    minutes: number;
    provisional_start_time : boolean;
    team_a_difficulty: number;
    team_a: number;
    team_a_score?: number;
    team_h_difficulty: number;
    team_h: number;
    team_h_score?: number;
    started?: boolean; 
    pulse_id: number;
    team_h_name?: string;
    team_a_name?: string;
    team_h_short_name?: string;
    team_a_short_name?: string;
//    fixture?: object;
    predictions: Record<string,Prediction>;
    score?: object;
    result?: string;
    odds?: {display:string, rank:string, value:string};
}
