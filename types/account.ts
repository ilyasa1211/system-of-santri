import { Document, ObjectId } from "mongoose";
import { IAccount } from "../models/account.model";

export type TAccount = Document<unknown, any, IAccount> &
    Omit<
        IAccount & {
            _id: ObjectId;
        },
        never
    >;
