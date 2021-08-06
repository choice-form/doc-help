/**
 * 文档树结构
 */
interface IDocTree {
  /**
   * 该层名字
   */
  name: string;
  /**
   * 自层数据
   */
  children?: IDocTree[];
}

declare module 'yamljs' {
  interface YmalJs {
    load(file: string): any;
    parse(ymlTxt: string): any;
  }
  const YmalJs: YmalJs;
  export = YmalJs;
}
