import { TestData } from '../types/test';
import testsRaw from '../data/tests.yaml';
const tests = testsRaw as Record<string, TestData>;

export const queryTechs = (criterion_id: string) => {
  const techs = [];
  Object.keys(tests).forEach(test => {
    if (tests[test].criteria.includes(criterion_id)) {
      tests[test].techs.forEach((tech: string) => {
        if (!techs.includes(tech)) {
          techs.push(tech);
        }
      });
    }
  });
  techs.sort();
  return techs;
};
