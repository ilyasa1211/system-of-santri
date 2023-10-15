import { ROLES } from "../enums/role";

export default function getRoleName(id: number): string {
    return ROLES[id];
}
