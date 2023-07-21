import results from '../data/results.yaml';

export const getResultsCount = (/** @type {string} */ test_id) => {
  return results.filter((/** @type {{ test: string; }} */ result) => result.test === test_id).length;
};
