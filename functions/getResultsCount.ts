import { Result } from '../types/result';
import resultsRaw from '../data/results.yaml';
const results: Result[] = resultsRaw;

export const getResultsCount = (test_id: string) => {
  return results.filter((result: Result) => result.test === test_id).length;
};
