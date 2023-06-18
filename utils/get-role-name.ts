import { ROLES } from "../traits";
import { ROLES_OFFSET } from "../traits/role";

export default function getRoleName(id: number): string {
  return Object.keys(ROLES)[id + ROLES_OFFSET];
}
