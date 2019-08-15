/**
 * 是否为需要排除的文件
 * @param file 
 */
export const isExclusiveFile = (file: string): boolean => {
  if (['.DS_Store', '.idea'].includes(file)) {
    return true;
  }
  if (file.startsWith('_')) {
    return true;
  }
  return false;
}

export const indexReg = /```\s*index\s*(\d+)\s*```/;
export const aliasReg = /```\s*alias\s*((?:[^`]+?\s?)*)\s*```/;
export const tagReg = /```\s*tag\s*((?:[^`]+?\s?)*)\s*```/;
export const summaryReg = /```\s*summary\s*((?:[^`]+?\s?)*)\s*```/;