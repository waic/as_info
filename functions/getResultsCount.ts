import { ResultData } from '../types/result';
import resultsRaw from '../data/results.yaml';
const results: ResultData[] = resultsRaw;

export const getResultsCount = (test_id: string) => {
  return results.filter((result: ResultData) => result.test === test_id).length;
};
