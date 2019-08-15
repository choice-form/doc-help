
import fs = require('fs');
import rimraf = require('rimraf');
import hasha = require('hasha');
import mkdirp = require('mkdirp');
import path = require('path');
import marked = require('marked');
import cheerio = require('cheerio');


export interface ISignStrStr {
  [key: string]: string;
}

export interface IDocMainUrl {
  indexUrl: string;
  searchUrl: string;
}

export interface IDocMain {
  cdn: string;
  langs: {
    [key: string]: IDocMainUrl;
  }
}

export interface IDocIndexData {
  name: string;
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
}


const docDir = 'doc';
const distDir = 'dist';

const cdnHost = 'https://media.choiceform.com/help';

const indexReg = /```\s*index\s*(\d+)\s*```/;
const aliasReg = /```\s*alias\s*((?:[^`]+?\s?)*)\s*```/;
const tagReg = /```\s*tag\s*((?:[^`]+?\s?)*)\s*```/;
const summaryReg = /```\s*summary\s*((?:[^`]+?\s?)*)\s*```/;

const build = () => {
  prepare();
  const langDirs = fs.readdirSync(docDir);
  const main: IDocMain = { cdn: cdnHost, langs: {} };
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

  sortIndexList(indexList);

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

  return {
    indexUrl: eraseDistPrefix(indexPath),
    searchUrl: eraseDistPrefix(searchPath)
  };
}


/**
 * 给索引目录排序并移除临时属性
 * @param indexList 
 */
const sortIndexList = (indexList: IDocIndexData[]) => {
  indexList.sort((a, b) => {
    return a.index > b.index ? 1 : -1;
  })
  indexList.forEach(item => {
    delete item.index;
    delete item.path;
    delete item.type
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        sortIndexList(item.children)
      }
    }
  })
}

/**
 * 检查匹配结果中是包含有效的注释信息
 * @param rs 
 */
const containsCommentData = (rs: RegExpMatchArray) => {
  return rs && rs[1] && rs[1].replace(/\s+/g, '') !== '';
}

/**
 * 构建索引目录
 * @param assetsHashMap 
 * @param indexList 
 */
const buildIndexList = (assetsHashMap: ISignStrStr, indexList: IDocIndexData[]) => {

  let searchList: IDocSearchData[] = [];

  indexList.forEach(data => {
    // 是文件的才需要再次处理
    if (data.type === 'file') {
      const search: IDocSearchData = { tags: [], summary: '', url: '' };
      let text = fs.readFileSync(data.url).toString();
      const indexMatch = text.match(indexReg);
      // 如果能匹配到，则删除这个注释
      if (indexMatch) {
        text = text.replace(indexReg, '');
      }
      // 找到了索引配置且其中有内容
      if (containsCommentData(indexMatch)) {
        // 写入索引，没找到的使用原始的0做索引
        data.index = Number(indexMatch[1]);
      }
      const tagMatch = text.match(tagReg);
      // 如果能匹配到，则删除这个注释
      if (tagMatch) {
        text = text.replace(tagReg, '');
      }
      // 找到了tag标记且其中有内容
      if (containsCommentData(tagMatch)) {
        // 去除掉多余的空格后按空格分割
        search.tags = tagMatch[1].replace(/\s+/g, ' ').trim().split(' ');
        // 没有找到tag的话使用各级标题做tag
      } else {
        const titleMatch = text.match(/#{1,5}\s+.+?\s*\n/g);
        if (titleMatch) {
          search.tags = titleMatch.map(text => {
            return text.replace(/[#\s]/g, '');
          });
        }
      }
      // 同时用第一个标题做名称
      data.alias = search.tags[0] || '';

      const summaryMatch = text.match(summaryReg);
      // 如果能匹配到，则删除这个注释
      if (summaryMatch) {
        text = text.replace(summaryReg, '');
      }
      // 找到了summary
      if (containsCommentData(summaryMatch)) {
        search.summary = summaryMatch[1];
        // 没有找到则后续再转化好的HTML提取文章第一个段落作为summary
      }

      // 替换图片地址
      const imgUrlReplaceFn = (match: string, first: string) => {
        const currentPath = path.resolve();
        const absoluteUrl = path.resolve(data.path, first);
        const relativeUrl = absoluteUrl.substr(currentPath.length + 1);
        const hashedUrl = assetsHashMap[relativeUrl];
        return match.replace(first, hashedUrl);
      }
      if (data.name === 'navbar.md') {
        debugger;
      }
      // 有三种插入格式， 1： 图片标签方式
      text = text.replace(/<img\s*.+?src=['"](.+?)['"]/g, imgUrlReplaceFn)
        // 2. markdown简洁语法  ![Alt text](图片链接) 
        .replace(/!\[.+?\]\((.+?)\)/g, imgUrlReplaceFn)
        // 3. markdown携带title的语法 ![Alt text](图片链接 "optional title") 
        .replace(/!\[.+?\]\((.+?)\s+.+?\)/g, imgUrlReplaceFn);

      // 替换markdown链接,仅仅去掉后缀名
      text = text.replace(/\[.+?\]\((.+?\.md)\)/g, (match, first: string) => {
        return match.replace(first, first.replace(/\.md$/, ''));
      })
      // 转化markdown
      const resource = {
        tags: search.tags,
        content: marked(text),
      }
      // 之前没有成功取到summary,从HTML中抽取第一个段落当成summary
      if (!search.summary) {
        const $ = cheerio.load(`<div>${resource.content}</div>`);
        const ps = $('p:not(blockquote p)');
        if (ps.length > 0) {
          search.summary = $(ps[0]).text();
        }
      }
      const resourceText = JSON.stringify(resource);
      const resourceHash = hasha(resourceText);
      let writePath = data.url.replace(/\.md$/, '.json')
      writePath = toDistPath(writePath);
      writePath = appendHash(writePath, resourceHash);
      writeFileInsureDir(writePath, resourceText);
      search.url = data.url = eraseDistPrefix(writePath);
      searchList.push(search);
    } else {
      // 是文件夹的深入扫描
      searchList = [
        ...searchList,
        ...buildIndexList(assetsHashMap, data.children)
      ];
    }
  })

  return searchList;
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
 * 是否为需要排除的文件
 * @param file 
 */
const isExclusiveFile = (file: string): boolean => {
  if (['.DS_Store', '.idea'].includes(file)) {
    return true;
  }
  if (file.startsWith('_')) {
    return true;
  }
  return false;
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
  // 同时有文件名和后缀将hash插到中间
  if (lastIndex > -1) {
    const head = path.substr(0, lastIndex);
    const tail = path.substr(lastIndex);
    result = head + '-' + hash + tail;
    // 否则将hash插到前面
  } else {
    result = hash + '-' + path;
  }
  return result;
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
        name, path: dir,
        alias: '??????', index: 0, type: 'dir'
      };
      // 扫描子资源的时候会尝试填充这个数据，如果没有填充别名就仍然会是问号。
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
        const indexMatch = text.match(indexReg);
        // 能匹配到序号
        if (containsCommentData(indexMatch)) {
          pIndexData.index = Number(indexMatch[1])
        }
        const aliasMatch = text.match(aliasReg);
        // 能匹配到别名
        if (containsCommentData(aliasMatch)) {
          pIndexData.alias = aliasMatch[1].replace(/\s+/g, ' ').trim();
        }
        // 是markdown文件
      } else if (name.endsWith('.md')) {
        ``
        // 推入一个初始数据，
        // 此时填入的地址是原始文件路径，
        // 此时不会转化markdown，
        // 因为要等所有其他资源转移好之后才能开始转化markdown
        // 后续会再次扫描indexList来通过url转化markdown,
        // 那时候会将真实的别名,索引和地址填入
        indexList.push({
          name, index: 0, alias: '',
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
        assetsHashMap[sub] = cdnHost + '/' + eraseDistPrefix(path);
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




build();