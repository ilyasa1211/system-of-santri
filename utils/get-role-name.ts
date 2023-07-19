import { ROLES } from "../traits";

export default function getRoleName(id: number): string {
	return ROLES[id];
}
