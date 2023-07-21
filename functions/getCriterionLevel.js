export const getCriterionLevel = ( /** @type {{ wcag20url?: string; level: String; }} */ criterion ) => {
  if (typeof criterion.wcag20url === 'undefined') {
    return `(WCAG 2.1 レベル${criterion.level})`;
  } else {
    return `(レベル${criterion.level})`;
  }
};
