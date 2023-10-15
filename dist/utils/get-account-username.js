export default function getAccountUsername(account) {
    if (typeof account === "string") {
        return account.split(" ").length < 3
            ? account.split(" ")[0]
            : account.split(" ")[1];
    }
    return getAccountUsername(account.name);
}
