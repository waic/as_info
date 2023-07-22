import results from '../data/results.yaml';

export const getResultsCount = (test_id: string) => {
  return results.filter((result: { test: string; }) => result.test === test_id).length;
};
