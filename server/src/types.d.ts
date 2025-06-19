declare module '@modelcontextprotocol/sdk' {
  export class Server {
    transport(type: string): this;
    catalog(tools: { functions: any[] }): this;
    addHandler(name: string, handler: (params: unknown) => any): this;
    start(): void;
  }
}
