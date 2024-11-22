import { CriterionData } from "../types/criterion";

export const getCriterionLevel = ( criterion: CriterionData ) => {
  if (criterion.wcag22url === 'tbd') {
    return `(WCAG 2.2 レベル${criterion.level})`;
  }
  if (criterion.wcag22note) {
    return `(レベル${criterion.level}) (WCAG 2.2 ${criterion.wcag22note})`;
  }
  if (criterion.wcag20url === undefined) {
    return `(WCAG 2.1 レベル${criterion.level})`;
  } else {
    return `(レベル${criterion.level})`;
  }
};
