
// 运行改脚本可以检查markdown链接是否存在死链。

import fs = require('fs');
import path = require('path');
import chalk = require('chalk');
/**
 * 获取要检查的文件夹，默认是doc文件夹
 */
const getDirs = () => {
  const allDirs = fs.readdirSync('doc').map(i => 'doc/' + i);
  return allDirs;
}


const checkDeadLink = (realLink: string, p: string, type: string) => {
  if (realLink.startsWith('http')) {
    return { realPath: '', dead: '' };
  }
  if (realLink.includes('#')) {
    realLink = realLink.substr(0, realLink.indexOf('#'));
  }
  const currentP = path.dirname(p);
  const realPath = path.resolve(currentP, realLink);
  let dead = ''
  if (!fs.existsSync(realPath)) {
    dead = `文件 ./${p} 中存在${type}死链 ${realLink} `;
  }
  return { realPath, dead };
}

/**
 * 扫描markdown文件检查链接
 * @param p
 */
const scanMarkdown = (p: string) => {
  const deadList: string[] = [];
  const text = fs.readFileSync(p).toString();
  // markdown之间的链接检查
  const mdReg = /\[[^\]]+\]\([^\)]+\)/g;
  const mdLinks = text.match(mdReg);
  if (mdLinks) {
    mdLinks.forEach(link => {
      let realLink = link.match(/\([^)]+/)[0].substr(1);
      const rs = checkDeadLink(realLink, p, 'markdown');
      if (rs.dead) {
        deadList.push(rs.dead);
      }
    })
  }
  // 和图片的检查
  const imgReg = /src=['"].+?['"]/g;
  const imgLinks = text.match(imgReg);
  const usedImgPathList: string[] = [];
  if (imgLinks) {
    imgLinks.forEach(link => {
      let realLink = link.substring(5, link.length - 1);
      const rs = checkDeadLink(realLink, p, 'image');
      if (rs.realPath) {
        usedImgPathList.push(rs.realPath.substr(path.resolve('').length + 1));
      }
      if (rs.dead) {
        deadList.push(rs.dead);
      }

    })
  }
  return { usedImgPathList, deadList }
}



const checkDirs = (dirs = ['']) => {
  let usedImgPathList: string[] = [];
  let imgFileList: string[] = [];
  let deadList: string[] = [];

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
      const sub = checkDirs(subDirs);
      usedImgPathList = [...usedImgPathList, ...sub.usedImgPathList];
      imgFileList = [...imgFileList, ...sub.imgFileList];
      deadList = [...deadList, ...sub.deadList];
    } else if (dir.endsWith('.md')) {
      const rs = scanMarkdown(dir);
      usedImgPathList = [...usedImgPathList, ...rs.usedImgPathList];
      deadList = [...deadList, ...rs.deadList];
    } else if (dir.endsWith('.png') || dir.endsWith('.gif') || dir.endsWith('.jpg')
      || dir.endsWith('.jpeg')) {
      imgFileList.push(dir);
    }
  })
  return { usedImgPathList, imgFileList, deadList };
}


const work = () => {
  const data = checkDirs(getDirs());
  data.imgFileList.forEach(imgPath => {
    const used = data.usedImgPathList.some(usedPath => {
      return usedPath === imgPath;
    });
    if (!used) {
      console.log(chalk.default.yellow(`图片 ./${imgPath} 从来没有被使用过`));
    }
  })
  data.deadList.forEach(rs => console.log(chalk.default.red(rs)));
}

work();



