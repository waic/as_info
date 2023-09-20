export function getTechDir(tech_id: string) {
  return tech_id.startsWith('ARIA') ? 'aria' : (tech_id.startsWith('C') ? 'css' : 'html');
}
