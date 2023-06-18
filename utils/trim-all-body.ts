import { Request } from "express";

export = function trimAllBody(request: Request) {
  for (const [key, value] of Object.entries(request.body)) {
    request.body[key] = (<string> value).trim();
  }
};
