import tests from '../data/tests.yaml';

export const queryTechs = (criterion_id: string) => {
  const techs = [];
  Object.keys(tests).forEach(test => {
    if (tests[test].criteria.includes(criterion_id)) {
      tests[test].techs.forEach((tech: any) => {
        if (!techs.includes(tech)) {
          techs.push(tech);
        }
      });
    }
  });
  techs.sort();
  return techs;
};
