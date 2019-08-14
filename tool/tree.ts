import * as fs from 'fs';

const mainLang = 'zh-cn';

const generateTree = (dir: string): IDocTree[] => {

  const list = fs.readdirSync(dir);

  const result: IDocTree[] = [];

  list.forEach(item => {
    const subDir = dir + '/' + item;
    const stat = fs.statSync(subDir);
    const tree: IDocTree = {
      name: item,
    }
    // 文件夹继续向内扫描
    if (stat.isDirectory()) {
      const subs = generateTree(subDir);
      if(subs){
        tree.children = subs;
        result.push(tree);
      }
    }else if(item.endsWith('.md')){
      result.push(tree);
    }
  })

  return result.length > 0 ? result : undefined;
}

const generateFile = () => {
  const data = generateTree('./doc/' + mainLang);
  fs.writeFileSync('./build/tree.json', JSON.stringify(data, null, '  '));
}

generateFile();