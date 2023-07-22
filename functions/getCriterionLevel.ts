import { Criterion } from "../types/criterion";

export const getCriterionLevel = ( criterion: Criterion ) => {
  if (typeof criterion.wcag20url === 'undefined') {
    return `(WCAG 2.1 レベル${criterion.level})`;
  } else {
    return `(レベル${criterion.level})`;
  }
};
