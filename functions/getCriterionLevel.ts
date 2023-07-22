export const getCriterionLevel = ( criterion: { wcag20url?: string; level: string; } ) => {
  if (typeof criterion.wcag20url === 'undefined') {
    return `(WCAG 2.1 レベル${criterion.level})`;
  } else {
    return `(レベル${criterion.level})`;
  }
};
