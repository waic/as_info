const techDirMap: { [key: string]: string } = {
  'ARIA': 'aria',
  'C': 'css',
  'SCR': 'client-side-script'
};

export function getTechDir(tech_id: string): string {
  for (const prefix in techDirMap) {
    if (tech_id.startsWith(prefix)) {
      return techDirMap[prefix];
    }
  }
  return 'html';
}