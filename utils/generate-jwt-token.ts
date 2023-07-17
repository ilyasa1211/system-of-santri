import jwt from "jsonwebtoken";

export function generateJwtToken(payload: Record<string, any>): string {
    const { id, email, name } = payload;
    return jwt.sign({ id, email, name }, process.env.JWT_SECRET as string);
}