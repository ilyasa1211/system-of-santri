import { IAccount } from "../models/account.model";

// foo bar zoo -> bar
// foo bar -> foo
export default function getAccountUsername(account: IAccount | string): string {
  if (typeof account === "string") {
    return account.split(" ").length < 3
      ? account.split(" ")[0]
      : account.split(" ")[1];
  }
  return getAccountUsername(account.name);
}
