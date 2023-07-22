import { Criterion } from '../types/criterion';
import criteriaRaw from '../data/criteria.yaml';
const criteria = criteriaRaw as Record<string, Criterion>;
import { getTestsCount } from './getTestsCount';

export const queryCriteriaWithTests = () => {
  return Object.keys(criteria).filter(key => getTestsCount(key) > 0);
};
