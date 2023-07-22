import { TestData } from '../types/test';
import testsRaw from '../data/tests.yaml';
const tests = testsRaw as Record<string, TestData>;

export const queryCriteria = (test_ids: string[], tech_id: string) => {
  const criteria = [];
  test_ids.forEach(test => {
    if (tests[test].techs.includes(tech_id)) {
      tests[test].criteria.forEach((criterion: string) => {
        if (!criteria.includes(criterion)) {
          criteria.push(criterion);
        }
      });
    }
  });
  criteria.sort();
  return criteria;
};
