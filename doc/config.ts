

export interface IDocAlias {
  'zh-cn': string;
  'en-us': string;
}


export interface IDocTree {
  name: string;
  alias: IDocAlias;
  children?: IDocTree[];
}


const config: IDocTree[] = [
]


export default config;