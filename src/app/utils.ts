import { Fixture } from './datatypes/fixture';
import { Odds } from './datatypes/odds';
import { Team } from './datatypes/team';
import { ValueDisplay } from './datatypes/valuedisplay';

export class Utils {
    static getResultIndex(f: Fixture) {
        return (f.team_h_score !== undefined && f.team_a_score !== undefined && f.team_h_score >= f.team_a_score) ? ((f.team_h_score === f.team_a_score) ? 1 : 0): 2
    }
    static rankOdds(arr:any[]) {
        return Utils.rankArray(arr, true).join('');
    }
    static rankArray(arr:any[], bAscending:boolean) {
    let sorted = arr.slice().sort(function(a, b) {
        return bAscending ? (a - b) : (b - a)
    })
    let ranks = arr.slice().map(function(v) {
    return sorted.indexOf(v) + 1
    });

    return ranks
    }
    static calculateFixtureProfit( fixture:Fixture | undefined, matchodds:Odds | undefined ): ValueDisplay{
        let value:number = 0;
        let display: string = "";
        if (fixture !== undefined && matchodds !== undefined) {
            if (fixture.team_h_score !== undefined && fixture.team_a_score !== undefined) {
                if (fixture.team_h_score > fixture.team_a_score) {
                  value = matchodds.home - 1
                  display = matchodds.dsp_home;
                }
                else if (fixture.team_a_score > fixture.team_h_score) {
                  value = matchodds.away - 1
                  display = matchodds.dsp_away;
                }
                else {
                  // draw
                  value = matchodds.draw - 1
                  display = matchodds.dsp_draw;
                }
            } 
        }
       
        let profit: ValueDisplay = {value:Math.round(100 * value)/100, display:display};
    
        return profit;
      }
    static addTeamNames(fixtures: Fixture[], teams: Team[]) : Fixture[] {
      fixtures.forEach((f:Fixture) => {
        let hteam:Team | undefined = teams.find((t:Team) => t.id === f.team_h)
        let ateam:Team | undefined = teams.find((t:Team) => t.id === f.team_a)
        f.team_h_name = hteam?.name
        f.team_a_name = ateam?.name
        f.team_h_short_name = hteam?.short_name
        f.team_a_short_name = ateam?.short_name
      });
      return fixtures;
    }
}