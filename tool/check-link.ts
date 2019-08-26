
// 运行改脚本可以检查markdown链接是否存在死链。

import fs = require('fs');
import path = require('path');

/**
 * 获取要检查的文件夹，默认是doc文件夹
 */
const getDirs = () => {
  let dirsArgv = process.argv.slice(2).filter(t => t.startsWith('dirs='))[0];
  if (dirsArgv) {
    dirsArgv = dirsArgv.substr(5);
    const dirs = dirsArgv.split(',');
    if (dirs.length > 0) {
      return dirs;
    }
  }
  const allDirs = fs.readdirSync('doc').map(i => 'doc/' + i);
  return allDirs;
}

// 结果列表
const result: string[] = [];


const checkDeadLink = (realLink: string, p: string, type: string) => {

  if (realLink.startsWith('http')) {
    return;
  }
  if (realLink.includes('#')) {
    realLink = realLink.substr(0, realLink.indexOf('#'));
  }
  const currentP = path.dirname(p);
  const realPath = path.resolve(currentP, realLink);
  if (!fs.existsSync(realPath)) {
    result.push(`文件 ./${p} 中存在${type}死链 ${realLink} `)
  }
}

/**
 * 扫描markdown文件检查链接
 * @param p
 */
const scanMarkdown = (p: string) => {
  const text = fs.readFileSync(p).toString();
  // markdown之间的链接检查
  const mdReg = /\[[^\]]+\]\([^\)]+\)/g;
  const mdLinks = text.match(mdReg);
  if (mdLinks) {
    mdLinks.forEach(link => {
      let realLink = link.match(/\([^)]+/)[0].substr(1);
      checkDeadLink(realLink, p, 'markdown');
    })
  }
  // 和图片的检查
  const imgReg = /src=['"].+?['"]/g;
  const imgLinks = text.match(imgReg);
  if (imgLinks) {
    imgLinks.forEach(link => {
      let realLink = link.substring(5, link.length - 1);
      checkDeadLink(realLink, p, 'image');
    })
  }
}



const check = (dirs = ['']) => {
  dirs.forEach(dir => {
    if (dir.startsWith('.') && dir[1] !== '/' && dir[1] !== '.') {
      return;
    }
    const stat = fs.statSync(dir);
    if (stat.isDirectory()) {
      const base = dir + '/';
      const subDirs = fs.readdirSync(base).map(i => {
        return base + i;
      });
      check(subDirs);
    } else if (dir.endsWith('.md')) {
      scanMarkdown(dir);
    }
  })
}


check(getDirs());
result.forEach(rs => console.log(rs));
