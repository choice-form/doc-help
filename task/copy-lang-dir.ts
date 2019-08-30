import fs = require('fs');
import mkdirp = require('mkdirp');
import { isExclusiveFile, indexReg } from './common';

/**
 * 这个脚本用来将一个语言的文档层次结构为蓝本，生成另外一个语言的文档层次结构，生成的机构中文档内容出了基础注释外都为空。
 * 命令行使用格式： tsc & node build/task/copy-lang-dir.js fromLang toLang
 * 例如，当前有中文文档，而没有英文文档，可以运行以下命令生成一个和中文文档层次结构一样的英文文档文件夹：
 * tsc & build/task/copy-lang-dir.js zh-cn en-us
 */

/**
 * 转移文档层级结构
 */
const copy = () => {
  const fromLang = process.argv[2];
  const toLang = process.argv[3];
  // 参数检查
  if (!fromLang || !toLang || fromLang === toLang) {
    console.log('invalid lang string provided')
    return;
  }

  const fromLangDir = 'doc/' + fromLang;
  const toLangDir = 'doc/' + toLang;
  mkdirp.sync('doc/' + toLang);
  copyDir(fromLangDir, toLangDir);
}

/**
 * 转移某个目录
 * @param fromDir 
 * @param toDir 
 */
const copyDir = (fromDir: string, toDir: string) => {
  const list = fs.readdirSync(fromDir);
  list.forEach(name => {
    if (isExclusiveFile(name)) {
      return;
    }
    const fromSub = fromDir + '/' + name;
    const toSub = toDir + '/' + name;
    const stat = fs.statSync(fromSub);
    // 文件夹
    if (stat.isDirectory()) {
      // 创建文件夹
      mkdirp.sync(toSub);
      // 并深层转移
      copyDir(fromSub, toSub);
      // 文档文件或索引文件
    } else if (name.endsWith('.md') || name === '.index') {
      // 已存在该文件则跳过不处理
      if (fs.existsSync(toSub)) {
        return;
      }
      // 未存在则尝试生成
      const fromText = fs.readFileSync(fromSub).toString();
      let toText = '';
      const indexMatch = fromText.match(indexReg);
      // 尝试沿用原有的序号
      if (indexMatch) {
        toText += indexMatch[0];
      } else {
        // 否则新生成空的
        toText += '```index\n' + '\n```\n';
      }
      // 索引文件
      if (name === '.index') {
        // 新生成空的别名
        toText += '\n```alias\n' + '\n```\n';
        // 文档文件
      } else {
        // 新生成空的tag和summary注释
        toText += '\n```tag\n' + '\n```\n';
        toText += '\n```summary\n' + '\n```\n';
        const title = name.replace(/.md$/, '');
        // 用名称新生成标题和段落
        toText += '\n# ' + title + '\n' + title + '\n';
      }
      fs.writeFileSync(toSub, toText);
    }
  });
}

copy();


