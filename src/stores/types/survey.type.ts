export interface ISport {
  id: number;
  name: string;
  icon: string;
  sportId: number;
  createdAt: Date;
}

export interface ISportResponse {
  status: number;
  data: ISport[];
}

export interface ILeague {
  id: number;
  name: string;
  sportId: number;
  createdAt: Date;
}

export interface ILeagueRespone {
  status: number;
  data: ILeague[];
}

export interface IMarket {
  id: number;
  name: string;
  createdAt: Date;
}

export interface IMarketResponse {
  status: number;
  data: IMarket[];
}

export interface ITeam {
  id: number;
  name: string;
  marketId?: any;
  icon?: any;
  sportId?: any;
  leagueId: number;
  code?: any;
  createdAt: Date;
}

export interface ITeamData {
  leagueName: string;
  teams: ITeam[];
}

export interface ITeamResponse {
  status: number;
  data: ITeamData;
}

export interface League {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
}

export interface Market {
  id: number;
  name: string;
}

export interface Sport {
  id: number;
  name: string;
}

export interface IData {
  leagues: League[];
  teams: Team[];
  markets: Market[];
  sports: Sport[];
}

export interface IUserSurveyInfo {
  status: number;
  data: IData;
}
