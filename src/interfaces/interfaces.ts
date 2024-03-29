import { Router } from "express";

export interface IRoutes {
  registerRoutes(): Router;
}

export interface ISendEmail {
  readonly subject: string;
  readonly pugFilename: string;
}
