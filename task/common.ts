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
/**
 * 目录索引顺序匹配正则
 */
export const indexReg = /```\s*index\s*(\d*)\s*```/;

/**
 * 目录别名匹配正则
 */
export const aliasReg = /```\s*alias\s*((?:[^`]+?\s?)*)\s*```/;

/**
 * yaml数据文本匹配正则
 */
export const yamlReg = /---\n(?:.*\n)+---\n/