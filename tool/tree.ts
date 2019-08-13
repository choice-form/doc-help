import * as fs from 'fs';
import { IDocTree } from '../doc/config';

const mainLang = 'zh-cn';

const generateTree = (dir: string): IDocTree[] => {

  const list = fs.readdirSync(dir);

  const result: IDocTree[] = [];

  list.forEach(item => {
    const subDir = dir + '/' + item;
    const stat = fs.statSync(subDir);
    const tree: IDocTree = {
      name: item,
      alias: { "zh-cn": '', "en-us": '' },
    }
    if (stat.isDirectory()) {
      tree.children = generateTree(subDir);
    }
    result.push(tree);
  })

  return result.length > 0 ? result : undefined;
}

const generateFile = () => {
  const data = generateTree('./doc/' + mainLang);
  fs.writeFileSync('./build/tree.json', JSON.stringify(data, null, '  '));
}

generateFile();