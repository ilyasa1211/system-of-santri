import jwt from "jsonwebtoken";

export function generateJwtToken(payload: Record<string, any>): string{
    return jwt.sign(payload, process.env.JWT_SECRET as string);
}