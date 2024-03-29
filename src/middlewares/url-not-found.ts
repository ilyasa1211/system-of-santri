import { NotFoundError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";

export function urlNotFound() {
  throw new NotFoundError(ResponseMessage.URL_NOT_FOUND);
}