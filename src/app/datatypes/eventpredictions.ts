import { EventPredictor } from "./eventpredictor";

export interface EventPredictions {
    event:number;
    result:string;
    odds:string;
    predictions:Record<string,EventPredictor>;
}