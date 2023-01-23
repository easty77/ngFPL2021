export interface EventPredictor {
    correct:{value:number, rank:number};
    points:{value:number, rank:number};
    profit:{value:number, display:string, rank:number};
}