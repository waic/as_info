import tests from '../data/tests.yaml';

export const getTestsCount = (criterion_id: string) => {
  // Return the number of tests that include criterion_id in test.criteria
  return Object.keys(tests).filter(key => tests[key].criteria.includes(criterion_id)).length;
};
