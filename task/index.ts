
import fs = require('fs');
import rimraf = require('rimraf');
import hasha = require('hasha');
import mkdirp = require('mkdirp');
import path = require('path');
import marked = require('marked');
import cheerio = require('cheerio');
import yamljs = require('yamljs');
import { isExclusiveFile, yamlReg } from './common';


/**
 * 傻白甜
 */
export interface ISignStrStr {
  [key: string]: string;
}

/**
 * 同yaml格式定义的头部信息解析出来后的数据结构
 */
interface IYamlJson {
  /**
   * 排序索引，影响在目录中前后顺序
   */
  index?: number,
  /**
   * 标签，用于辅助搜索
   */
  tags?: string[],
  /**
   * 概要信息，用于辅助搜索和搜索结果中展示概要
   */
  summary?: string,
  /**
   * 别名，用于在目录结构中显示的名字
   */
  alias?: string
};

/**
 * 编译到主入口文件中的资源地址总结数据结构
 */
export interface IDocMainUrl {
  /**
   * 目录结构资源地址
   */
  indexUrl: string;
  /**
   * 搜索辅助数据资源地址
   */
  searchUrl: string;
  /**
   * 页脚布局说明资源地址
   */
  footUrl: string;
  /**
   * 自定义区块说明资源地址
   */
  blockUrl: string;
}

/**
 * 总入口文件的数据结构
 */
export interface IDocMain {
  /**
   * cdn地址，所有的都来自这里
   */
  cdn: string;
  /**
   * 各个语言的入口数据组
   */
  langs: {
    [key: string]: IDocMainUrl;
  }
}

/**
 * 索引目录的数据结构
 */
export interface IDocIndexData {
  /**
   * 别名
   */
  alias: string;
  /**
   * 排序索引
   */
  index?: number;
  /**
   * 类型，分文件和目录
   */
  type?: 'file' | 'dir';
  /**
   * [目录专用]子目录
   */
  children?: IDocIndexData[];
  /**
   * [文件专用]对应的文档数据资源地址，
   */
  url?: string;
  /**
   * 路径标识名
   */
  path?: string;
}

/**
 * 辅助搜索文件的数据结构
 */
export interface IDocSearchData {
  /**
   * 标签列表
   */
  tags: string[];
  /**
   * 对应的文档概要说明
   */
  summary: string;
  /**
   * 对应的文档资源地址
   */
  url: string;
  /**
   * 对应文档的路径标识名
   */
  path: string;
  /**
   * 对一个的文档标题
   */
  title: string;
}

/**
 * 文档内容文件的数据结构
 */
export interface IDocData {
  /**
   * 标签列表
   */
  tags: string[],
  /**
   * 文档内容
   */
  content: string;
}

/**
 * 文档目录
 */
const docDir = 'doc';

/**
 * 构建目标目录
 */
const distDir = 'dist';

const cdnHost: { [key: string]: string } = {
  staging: 'https://media.choiceform.io/os-help-source/assets',
  prod: 'https://media.choiceform.com/os-help-source/assets',
}

const env = process.argv[2];
const cdn = cdnHost[env] || cdnHost.staging;

/**
 * 开始构建
 */
function build(): void {
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
function buildLang(lang: string): IDocMainUrl {
  // 先处理资源文件
  const { assetsHashMap, indexList } = buildAssets(docDir + '/' + lang, null);
  // 然后处理索引目录
  const searchList = buildIndexList(assetsHashMap, indexList);
  const footList: IDocIndexData[] = []
  const blockList: IDocIndexData[] = []
  unifyIndexList(indexList, footList, blockList);

  const writeFile = (list: any[], fileName: string) => {
    // 写入索引文件
    const text = JSON.stringify(list);
    const hash = hasha(text);
    let path = distDir + '/' + lang + '/' + fileName;
    path = appendHash(path, hash);
    writeFileInsureDir(path, text);
    return path;
  }
  const indexPath = writeFile(indexList, 'index.json');
  const searchPath = writeFile(searchList, 'search.json');
  const footPath = writeFile(footList, 'foot.json');
  const blockPath = writeFile(blockList, 'block.json');

  return {
    indexUrl: eraseDistPrefix(indexPath),
    searchUrl: eraseDistPrefix(searchPath),
    footUrl: eraseDistPrefix(footPath),
    blockUrl: eraseDistPrefix(blockPath),
  };
}

/**
 * 提炼目录
 * 给索引目录排序并移除临时属性
 * 同时,如若文件名携带了$$_符号的则移除
 * @param indexList 
 */
function unifyIndexList(indexList: IDocIndexData[], footList: IDocIndexData[], blockList: IDocIndexData[]): void {
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
    if (item.url) {
      if (item.url.includes('/$foot$_')) {
        indexList.splice(i, 1).forEach(item => {
          footList.unshift(item);
        });
      } else if (item.url.includes('/$block$_')) {
        indexList.splice(i, 1).forEach(item => {
          blockList.unshift(item);
        });
      }
    }
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        unifyIndexList(item.children, footList, blockList);
        // 如果内部已经清除干净了则清除自己
        if (item.children.length === 0) {
          indexList.splice(i, 1);
        }
      }
    }
  }
}

/**
 * 获取基于当成仓库的根目录的真实路径
 * @param selfPath 
 * @param relativeHref 
 */
function getRealUrl(selfPath: string, relativeHref: string): string {
  const cwd = path.resolve();
  const absoluteUrl = path.resolve(selfPath, relativeHref);
  const realUrl = absoluteUrl.substr(cwd.length + 1);
  return realUrl;
}

/**
 * md地址转文章名
 * @param url 
 * @returns 
 */
function mdUrlToArticleName(url: string): string {
  return url.replace(/doc\/.+?\//, '')
    .replace(/\.md$/, '').replace(/\//g, '_');
}

/**
 * json地址转文章名
 * @param url 
 * @returns 
 */
function jsonUrlToArticleName(url: string) {
  return url.replace(/^.+?\//, '')
    .replace(/-\w{8}\.json$/, '').replace(/\//g, '_');
}

/**
 * 构建索引目录
 * @param assetsHashMap 
 * @param indexList 
 */
function buildIndexList(assetsHashMap: ISignStrStr, indexList: IDocIndexData[], pTitle = '') {

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
function wrapTitle(pTitle: string, title: string): string {
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
function toDistPath(path: string): string {
  return path.replace(/^doc\//, 'dist/');
}

/**
 * 擦除路径开头的dist目录信息
 * @param path 
 */
function eraseDistPrefix(path: string): string {
  return path.replace(/^dist\//, '');
}

/**
 * 凭借hash到文件命中
 * @param path 
 * @param hash 
 */
function appendHash(path: string, hash: string): string {
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
function tryGetFileIndex(name: string): number {
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
function buildAssets(dir: string, pIndexData: IDocIndexData): {
  assetsHashMap: ISignStrStr;
  indexList: IDocIndexData[];
} {
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
function writeFileInsureDir(path: string, content: string | Buffer): void {
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
function prepare(): void {
  rimraf.sync(distDir);
  fs.mkdirSync(distDir);
}

/**
 * 獲取yaml文本中的数据转成json对象
 * @param text
 * @returns 
 */
function getYmlJson(text: string): { json: IYamlJson, text: string } {
  const ymlMatch = text.match(yamlReg);
  if (ymlMatch) {
    return {
      json: yamljs.parse(ymlMatch[0]),
      text: text.replace(yamlReg, ''),
    };
  }
  return { text, json: {} };
}

build();



