import criteria from '../data/criteria.yaml';
import { getTestsCount } from './getTestsCount';

export const queryCriteriaWithTests = () => {
  return Object.keys(criteria).filter(key => getTestsCount(key) > 0);
};
