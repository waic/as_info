import tests from '../data/tests.yaml';

export const queryCriteria = (/** @type {string[]} */ test_ids, /** @type {string} */ tech_id) => {
  const criteria = [];
  test_ids.forEach(test => {
    if (tests[test].techs.includes(tech_id)) {
      tests[test].criteria.forEach(criterion => {
        if (!criteria.includes(criterion)) {
          criteria.push(criterion);
        }
      });
    }
  });
  criteria.sort();
  return criteria;
};
