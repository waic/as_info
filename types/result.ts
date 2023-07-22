export interface ResultContent {
  expected: string;
  procedure: string;
  actual: string;
  judgment: string;
}
export interface ResultData {
  id: number;
  test: string;
  os: string;
  user_agent: string;
  assistive_tech: string;
  assistive_tech_config: string;
  contents: ResultContent[];
  comment: string;
  tester: string;
  date: string;
}
