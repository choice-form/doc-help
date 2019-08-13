
// 运行改脚本可以检查markdown链接是否存在死链。

import fs = require('fs');
import path = require('path');

const getDirs = () => {
  let dirsArgv = process.argv.slice(2).filter(t => t.startsWith('dirs='))[0];
  if (dirsArgv) {
    dirsArgv = dirsArgv.substr(5);
    const dirs = dirsArgv.split(',');
    if (dirs.length > 0) {
      return dirs;
    }
  }
  const allDirs = fs.readdirSync('./');
  return allDirs;
}


const result: string[] = [];

const scanMd = (p: string) => {
  const text = fs.readFileSync(p).toString();
  const reg = /\[[^\]]+\]\([^\)]+\)/g;
  const links = text.match(reg);
  if (links) {
    links.forEach(link => {
      let realLink = link.match(/\([^)]+/)[0].substr(1);
      if (realLink.includes('#')) {
        realLink = realLink.substr(0, realLink.indexOf('#'));
      }
      const currentP = p.substr(0, p.lastIndexOf('/'));
      const realPath = path.resolve(currentP, realLink);
      if (!fs.existsSync(realPath)) {
        result.push(`文件 ./${p} 中存在死链 ${realLink} `)
      }
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
      scanMd(dir);
    }
  })
}


check(getDirs());
result.forEach(rs => console.log(rs));
