import { Request } from "express";

export = function trimAllBody(reqBody: Request) {
  for (const [key, value] of Object.entries(reqBody.body)) {
    reqBody.body[key] = (<string> value).trim();
  }
}
