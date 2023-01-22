export interface Odds {
    fixture_id: number;
    event: number
    home: number;
    away: number;
    draw: number;
    dsp_home: string;
    dsp_away: string;
    dsp_draw: string;
    rank?: number[];
}