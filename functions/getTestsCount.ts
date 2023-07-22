import { Test } from '../types/test';
import testsRaw from '../data/tests.yaml';
const tests = testsRaw as Record<string, Test>;

export const getTestsCount = (criterion_id: string) => {
  // Return the number of tests that include criterion_id in test.criteria
  return Object.keys(tests).filter(key => tests[key].criteria.includes(criterion_id)).length;
};
