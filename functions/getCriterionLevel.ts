import { CriterionData } from "../types/criterion";

export const getCriterionLevel = ( criterion: CriterionData ) => {
  if (typeof criterion.wcag20url === 'undefined') {
    return `(WCAG 2.1 レベル${criterion.level})`;
  } else {
    return `(レベル${criterion.level})`;
  }
};
