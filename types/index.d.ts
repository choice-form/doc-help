interface IDocTree {
  name: string;
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
