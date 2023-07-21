import tests from '../data/tests.yaml';

export const queryTechs = (/** @type {string} */ criterion_id) => {
  const techs = [];
  Object.keys(tests).forEach(test => {
    if (tests[test].criteria.includes(criterion_id)) {
      tests[test].techs.forEach(tech => {
        if (!techs.includes(tech)) {
          techs.push(tech);
        }
      });
    }
  });
  techs.sort();
  return techs;
};
