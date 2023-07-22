import tests from '../data/tests.yaml';

export const queryCriteria = (test_ids: string[], tech_id: string) => {
  const criteria = [];
  test_ids.forEach(test => {
    if (tests[test].techs.includes(tech_id)) {
      tests[test].criteria.forEach((criterion: any) => {
        if (!criteria.includes(criterion)) {
          criteria.push(criterion);
        }
      });
    }
  });
  criteria.sort();
  return criteria;
};
