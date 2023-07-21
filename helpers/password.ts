import argon2 from "argon2";

export default class Password {
	public static async hash(plainPassword: string) {
		return argon2.hash(plainPassword, { type: argon2.argon2i });
	}
    public static async verify(hashedPassword: string, plainPassword: string) {
        return argon2.verify(hashedPassword, plainPassword);
    }
}
