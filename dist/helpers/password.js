import argon2 from "argon2";
export default class Password {
    static async hash(plainPassword) {
        return argon2.hash(plainPassword, { type: argon2.argon2i });
    }
    static async verify(hashedPassword, plainPassword) {
        return argon2.verify(hashedPassword, plainPassword);
    }
}
