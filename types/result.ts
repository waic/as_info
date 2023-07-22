export interface Content {
  expected: string;
  procedure: string;
  actual: string;
  judgment: string;
}
export interface Result {
  id: number;
  test: string;
  os: string;
  user_agent: string;
  assistive_tech: string;
  assistive_tech_config: string;
  contents: Content[];
  comment: string;
  tester: string;
  date: string;
}
