import results from '../data/results.yaml';

export const getResultsCount = (test_id) => {
  return results.filter(result => result.test === test_id).length;
};
