import argon2 from "argon2";

export async function hashPassword(plainTextPassword: string): Promise<string> {
    return argon2.hash(plainTextPassword, {
        type: argon2.argon2i,
    });
}