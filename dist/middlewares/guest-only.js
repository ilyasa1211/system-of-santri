import { ResponseMessage } from "../enums/response";
export default function guestOnly(request, response, next) {
    if (request.isAuthenticated()) {
        return response.json({ message: ResponseMessage.ALREADY_LOGIN });
    }
    next();
}
