export interface IRoutes {
  registerRoutes(): void;
}

export interface ISendEmail {
  readonly subject: string;
  readonly pugFilename: string;
}
