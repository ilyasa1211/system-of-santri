export class CaseStyle {
	private _input: string;
	private _divider: string;
	private _joinWith: string | null;
	public constructor(
		input: string,
		divider: string = " ",
		joinWith: string | null = null,
	) {
		this._input = input;
		this._divider = divider;
		this._joinWith = joinWith;
	}

	public toCamelCase() {
		return this._input.split(this._divider).map(
			(input: string, index: number) => {
				return index === 0 ? input : input[0].toUpperCase() + input.slice(1);
			},
		).join(this._joinWith ?? "");
	}

	public toPacalCase() {
		return this._input.split(this._divider).map((input: string) =>
			input.toUpperCase()
		).join(this._joinWith ?? "");
	}

	public toSnakeCase() {
		return this._input.split(this._divider).map((input: string) =>
			input.toLowerCase()
		).join(this._joinWith ?? "_");
	}
}
