
import fs = require('fs');
import rimraf = require('rimraf');
import hasha = require('hasha');
import mkdirp = require('mkdirp');
import path = require('path');
import marked = require('marked');
import cheerio = require('cheerio');
import yamljs = require('yamljs');
import { isExclusiveFile, yamlReg } from './common';

interface IYamlJson { index?: number, tags?: string[], summary?: string, alias?: string };

export interface ISignStrStr {
  [key: string]: string;
}

export interface IDocMainUrl {
  indexUrl: string;
  searchUrl: string;
  footUrl: string;
}

export interface IDocMain {
  cdn: string;
  langs: {
    [key: string]: IDocMainUrl;
  }
}

export interface IDocIndexData {
  alias: string;
  index?: number;
  type?: 'file' | 'dir';
  children?: IDocIndexData[];
  url?: string;
  path?: string;
}

export interface IDocSearchData {
  tags: string[];
  summary: string;
  url: string;
  path: string;
  title: string;
}

export interface IDocData {
  tags: string[],
  content: string;
}


const docDir = 'doc';
const distDir = 'dist';

const cdnHost: { [key: string]: string } = {
  staging: 'https://media.choiceform.io/os-help-source/assets',
  prod: 'https://media.choiceform.com/os-help-source/assets',
}

const env = process.argv[2];
const cdn = cdnHost[env] || cdnHost.staging;


const build = () => {
  prepare();


  const langDirs = fs.readdirSync(docDir);
  const main: IDocMain = { cdn, langs: {} };
  langDirs.forEach(lang => {
    const stat = fs.statSync(docDir + '/' + lang);
    if (stat.isDirectory()) {
      main.langs[lang] = buildLang(lang);
    }
  })
  writeFileInsureDir(distDir + '/main.json', JSON.stringify(main));
}


/**
 * 构建一个语言
 * @param lang 
 */
const buildLang = (lang: string): IDocMainUrl => {
  // 先处理资源文件
  const { assetsHashMap, indexList } = buildAssets(docDir + '/' + lang, null);
  // 然后处理索引目录
  const searchList = buildIndexList(assetsHashMap, indexList);
  const footList: IDocIndexData[] = []
  unifyIndexList(indexList, footList);
  // 写入索引文件
  const indexText = JSON.stringify(indexList);
  const indexHash = hasha(indexText);
  let indexPath = distDir + '/' + lang + '/index.json';
  indexPath = appendHash(indexPath, indexHash);
  writeFileInsureDir(indexPath, indexText);
  // 写入搜索文件
  const searchText = JSON.stringify(searchList);
  const searchHash = hasha(searchText);
  let searchPath = distDir + '/' + lang + '/search.json';
  searchPath = appendHash(searchPath, searchHash);
  writeFileInsureDir(searchPath, searchText);
  // 写入脚部文件
  const footText = JSON.stringify(footList);
  const footHash = hasha(footText);
  let footPath = distDir + '/' + lang + '/foot.json';
  footPath = appendHash(footPath, footHash);
  writeFileInsureDir(footPath, footText);

  // // 重写文档文件
  // rewriteDoc(searchList);
  return {
    indexUrl: eraseDistPrefix(indexPath),
    searchUrl: eraseDistPrefix(searchPath),
    footUrl: eraseDistPrefix(footPath),
  };
}

/**
 * 提炼目录
 * 给索引目录排序并移除临时属性
 * 同时,如若文件名携带了$$_符号的则移除
 * @param indexList 
 */
const unifyIndexList = (indexList: IDocIndexData[], footList: IDocIndexData[]) => {
  indexList.sort((a, b) => {
    return a.index > b.index ? 1 : -1;
  })
  for (let i = indexList.length - 1; i >= 0; i--) {
    const item = indexList[i];
    delete item.index;
    delete item.path;
    delete item.type;
    if (item.url) {
      item.path = jsonUrlToArticleName(item.url);
    }
    if (item.url && item.url.includes('/$foot$_')) {
      indexList.splice(i, 1).forEach(item => {
        footList.unshift(item);
      });
    }
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        unifyIndexList(item.children, footList);
        // 如果内部已经清除干净了则清除自己
        if (item.children.length === 0) {
          indexList.splice(i, 1);
        }
      }
    }
  }
}

/**
 * 检查匹配结果中是包含有效的注释信息
 * @param rs 
 */
// const containsCommentData = (rs: RegExpMatchArray) => {
//   return rs && rs[1] && rs[1].replace(/\s+/g, '') !== '';
// }

/**
 * 获取基于当成仓库的根目录的真实路径
 * @param selfPath 
 * @param relativeHref 
 */
const getRealUrl = (selfPath: string, relativeHref: string) => {
  const cwd = path.resolve();
  const absoluteUrl = path.resolve(selfPath, relativeHref);
  const realUrl = absoluteUrl.substr(cwd.length + 1);
  return realUrl;
}


const mdUrlToArticleName = (url: string) => {
  return url.replace(/doc\/.+?\//, '')
    .replace(/\.md$/, '').replace(/\//g, '_');
}

const jsonUrlToArticleName = (url: string) => {
  return url.replace(/^.+?\//, '')
    .replace(/-\w{8}\.json$/, '').replace(/\//g, '_');
}

/**
 * 构建索引目录
 * @param assetsHashMap 
 * @param indexList 
 */
const buildIndexList = (assetsHashMap: ISignStrStr, indexList: IDocIndexData[], pTitle = '') => {

  let searchList: IDocSearchData[] = [];

  indexList.forEach(data => {

    // 是文件的才需要再次处理
    if (data.type === 'file') {
      const search: IDocSearchData = {
        path: mdUrlToArticleName(data.url),
        title: '',
        tags: [], summary: '', url: ''
      };
      let text = fs.readFileSync(data.url).toString();
      let result = getYmlJson(text);
      const ymlJson = result.json;
      text = result.text;
      // 找到了索引配置且其中有内容
      if (ymlJson.index != undefined) {
        // 写入索引，没找到的使用原始的0做索引
        data.index = ymlJson.index;
      }
      const titleMatch = text.match(/#{1,5}\s+.+?\s*\n/g) || [];
      const tagsFromTitle = titleMatch.map(text => {
        return text.replace(/[#\s]/g, '');
      });
      // 找到了tag标记且其中有内容
      if (ymlJson.tags != undefined) {
        // 去除掉多余的空格后按空格分割
        search.tags = ymlJson.tags;
        // 没有找到tag的话使用各级标题做tag
      } else {
        search.tags = tagsFromTitle;

      }

      // 同时用第一个标题或第一个tag做名称
      data.alias = tagsFromTitle[0] || search.tags[0] || '';
      // 找到了summary
      if (ymlJson.summary != undefined) {
        search.summary = ymlJson.summary;
        // 没有找到则后续再转化好的HTML提取文章第一个段落作为summary
      }


      // 替换图片地址
      const imgUrlReplaceFn = (match: string, first: string) => {
        const realUrl = getRealUrl(data.path, first);
        const hashedUrl = assetsHashMap[realUrl];
        return match.replace(first, hashedUrl);
      }
      // 有三种插入格式， 1： 图片标签方式
      text = text.replace(/<img\s*.+?src=['"](.+?)['"]/g, imgUrlReplaceFn)
        // 2. markdown简洁语法  ![Alt text](图片链接) 
        .replace(/!\[.+?\]\((.+?)\)/g, imgUrlReplaceFn)
        // 3. markdown携带title的语法 ![Alt text](图片链接 "optional title") 
        .replace(/!\[.+?\]\((.+?)\s+.+?\)/g, imgUrlReplaceFn);
      const selfPath = path.dirname(data.url);
      // 替换链接地址 
      const linkReplaceFn = (match: string, first: string, second: string) => {
        if (second) {
          const [realHref, suffix] = second.split('#');
          if (realHref.endsWith('.md')) {
            const relativeHref = realHref.replace(/.md$/, '');
            const realUrl = getRealUrl(selfPath, relativeHref);
            const linkUrl = '/articles/' + mdUrlToArticleName(realUrl)
            const fullLinkUrl = suffix ? linkUrl + '#' + suffix : linkUrl;
            return first + '(' + fullLinkUrl + ')';
          }
        }
        return match;
      }
      // 替换链接地址
      text = text.replace(/(\[.+?\])\((.+?)\)/g, linkReplaceFn);

      // 替换双等号高亮
      text = text.replace(/==(.+?)==/g, '<mark>$1</mark>');

      // 转化markdown
      const resource: IDocData = {
        tags: search.tags,
        content: marked(text),
      }

      // 之前没有成功取到summary,从HTML中抽取第一个段落当成summary
      if (!search.summary) {
        const $ = cheerio.load(`<div>${resource.content}</div>`);
        const $ps = $('p:not(blockquote p)');
        if ($ps.length > 0) {
          search.summary = $($ps[0]).text();
        }
      }

      const resourceText = JSON.stringify(resource);
      const resourceHash = hasha(resourceText);
      let writePath = data.url.replace(/\.md$/, '.json')
      writePath = toDistPath(writePath);
      writePath = appendHash(writePath, resourceHash);
      writeFileInsureDir(writePath, resourceText);
      search.url = data.url = eraseDistPrefix(writePath);
      search.title = wrapTitle(pTitle, data.alias);
      searchList.push(search);
    } else {
      const title = wrapTitle(pTitle, data.alias);
      // 是文件夹的深入扫描
      searchList = [
        ...searchList,
        ...buildIndexList(assetsHashMap, data.children, title)
      ];
    }
  })

  return searchList;
}

/**
 * 包裹头部信息
 * @param pTitle 
 * @param title 
 */
const wrapTitle = (pTitle: string, title: string) => {
  const exTitle = title.startsWith('<span>')
    ? title : `<span>${title}</span>`;
  const rs = pTitle
    ? pTitle + '<span>|</span>' + exTitle
    : exTitle;
  return rs;
}

/**
 * 转化为目标文件地址
 * @param path 
 */
const toDistPath = (path: string) => {
  return path.replace(/^doc\//, 'dist/');
}

/**
 * 擦除路径开头的dist目录信息
 * @param path 
 */
const eraseDistPrefix = (path: string) => {
  return path.replace(/^dist\//, '');
}

/**
 * 凭借hash到文件命中
 * @param path 
 * @param hash 
 */
const appendHash = (path: string, hash: string) => {
  hash = hash.substr(0, 8);
  let result = '';
  const lastIndex = path.lastIndexOf('.');
  // 同时有文件名和后缀将hash插到文件名中间
  if (lastIndex > -1) {
    const head = path.substr(0, lastIndex);
    const tail = path.substr(lastIndex);
    result = head + '-' + hash + tail;
    // 否则将hash插到文件名后面
  } else {
    result = path + '-' + hash;
  }
  return result;
}

/**
 * 尝试获取文件的自然索引
 * 会从文件名开头抽取数字,如果抽取不到,
 * 则使用1000000,好让其排在其他有序号的文件的后面
 * @param name 
 */
const tryGetFileIndex = (name: string) => {
  const numPrefixMatch = name.match(/^\d+/);
  let index = 1000000;
  if (numPrefixMatch) {
    index = Number(numPrefixMatch)
  }
  return index;
}


/**
 * 处理资源文件
 * 资源文件要先被转移掉，转移时会生成hash映射表，
 * 同时会生成原始的目录索引数据，
 * 后续处理markdown文件时可利用hash映射表替换引用的资源，
 * 还可以在此扫描原始的目录索引数据一次转化markdown文件，
 * 并将转化好的关联信息填会到原始的目录索引数据中，从而得到真正的目录索引数据
 * @param dir 
 * @param pIndexData 
 */
const buildAssets = (dir: string, pIndexData: IDocIndexData) => {
  const list = fs.readdirSync(dir);
  let assetsHashMap: ISignStrStr = {};
  const indexList: IDocIndexData[] = [];
  list.forEach(name => {
    if (isExclusiveFile(name)) {
      return;
    }
    const sub = dir + '/' + name;
    const stat = fs.statSync(sub);
    // 文件夹继续深入
    if (stat.isDirectory()) {

      // 生成一个空索引数据
      const indexData: IDocIndexData = {
        path: dir,
        alias: name,
        index: tryGetFileIndex(name),
        type: 'dir'
      };
      // 扫描子资源的时候会尝试填充这个数据，如果没有填充别名就仍然会是原始名称。
      const data = buildAssets(sub, indexData);
      // 吸收子资源的hash
      assetsHashMap = {
        ...assetsHashMap,
        ...data.assetsHashMap,
      }

      // 文件文件夹中扫描扫描到了有效的文档文件
      if (data.indexList.length > 0) {
        indexData.children = data.indexList;
        indexList.push(indexData);
        // 扫描不到的话说明这是一个纯资源文件，不需要加入到目录索引中
      }
      // 是文件
    } else {
      // 是文件夹索引文件
      if (name === '.index' && pIndexData) {
        const text = fs.readFileSync(sub).toString();

        let { json: ymlJson } = getYmlJson(text);
        // 能匹配到序号
        if (ymlJson.index != undefined) {
          pIndexData.index = ymlJson.index;
        }
        // 能匹配到别名
        if (ymlJson.alias) {
          pIndexData.alias = ymlJson.alias;
        }
        // 是markdown文件
      } else if (name.endsWith('.md')) {

        // 推入一个初始数据，
        // 此时填入的地址是原始文件路径，
        // 此时不会转化markdown，
        // 因为要等所有其他资源转移好之后才能开始转化markdown
        // 后续会再次扫描indexList来通过url转化markdown,
        // 那时候会将真实的别名,索引和地址填入
        indexList.push({
          index: tryGetFileIndex(name), alias: '',
          url: sub, type: 'file',
          path: dir,
        })
        // 是其他资源文件,打好hash后写入到dist里对应文件家中
        // 同时记录大hash映射表
      } else {
        const buff = fs.readFileSync(sub);
        let path = appendHash(sub, hasha(buff));
        path = toDistPath(path);
        writeFileInsureDir(path, buff);
        assetsHashMap[sub] = cdn + '/' + eraseDistPrefix(path);
      }
    }
  });

  return { assetsHashMap, indexList };
}


/**
 * 写入文件，如果没有上场目录会创建上层目录。
 * @param path 
 * @param content 
 */
const writeFileInsureDir = (path: string, content: string | Buffer) => {
  const lastIndex = path.lastIndexOf('/');
  const pDir = path.substr(0, lastIndex);
  if (pDir) {
    mkdirp.sync(pDir);
  }
  fs.writeFileSync(path, content);
}

/**
 * 做准备，移除dist目录，在重新创建空的dist目录
 */
const prepare = () => {
  rimraf.sync(distDir);
  fs.mkdirSync(distDir);
}



// /**
//  * 重写文档,因为要更正里面的链接，而连接都得带hash
//  * 所以只能等全部文件写完判定好hash后才能改写，
//  * 改写后元hash会和真实hash不一样，但这不影响我们，
//  * 我们的hash只用来区别更改的版本。
//  * @param searchList 
//  */
// const rewriteDoc = (searchList: IDocSearchData[]) => {
//   searchList.forEach(item => {
//     const filePath = distDir + '/' + item.url;
//     const data = JSON.parse(fs.readFileSync(filePath).toString()) as IDocData;
//     const $ = cheerio.load(`<div>${data.content}</div>`, { decodeEntities: false });
//     const $aList = $('a');
//     const selfPath = path.dirname(item.url)
//     // 尝试替换其中a标签的链接
//     $aList.each((idx, a) => {
//       const $a = $(a);
//       const href = $a.attr('href');
//       if (href) {
//         const [realHref, suffix] = href.split('#');
//         if (realHref.endsWith('.md')) {
//           const relativeHref = realHref.replace(/.md$/, '');
//           const realUrl = getRealUrl(selfPath, relativeHref);
//           const targetItem = searchList.find(sItem => {
//             return sItem.url.startsWith(realUrl) && sItem.url.length === realUrl.length + 14;
//           })
//           if (targetItem) {
//             const recoverUrl = suffix ? targetItem.url + '#' + suffix : targetItem.url;
//             $a.attr('href', recoverUrl);
//           }
//         }
//       }
//     });
//     data.content = $('body > div').html();
//     // 替换完成后写回文件
//     fs.writeFileSync(filePath, JSON.stringify(data));
//   })
// }


const getYmlJson = (text: string): { json: IYamlJson, text: string } => {
  const ymlMatch = text.match(yamlReg);
  if (ymlMatch) {
    return {
      json: yamljs.parse(ymlMatch[0]),
      text: text.replace(yamlReg, ''),
    };
  }
  return { text, json: {} };
}

/**
 * 
 * @param file 
 * @param json 
 * @param text 
 */
// @ts-ignore
// const feedbackYaml = (file: string, json: IYmlJson, text: string) => {
//   let ymlText = '---\n';
//   Object.keys(json).forEach((key: keyof IYmlJson) => {
//     let txt = '  ' + key + ': ';
//     let val = json[key];
//     if (val instanceof Array) {
//       txt += '[' + val.join(', ') + ']';
//     } else {
//       txt += val;
//     }
//     txt += '\n';
//     ymlText += txt;
//   })
//   ymlText += '---\n' + text;
//   fs.writeFileSync(file, ymlText);

// }



build();



