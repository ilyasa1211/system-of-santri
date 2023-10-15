export class CaseStyle {
    constructor(input, divider = " ") {
        this.input = input;
        this.divider = divider;
    }
    static convert(string) {
        return this.convert(string);
    }
}
export class PascalCase extends CaseStyle {
    constructor(_string, _divider = " ") {
        super(_string, _divider);
        this._string = _string;
        this._divider = _divider;
        this._joinWith = "";
    }
    convert() {
        return PascalCase.convert(this._string);
    }
    static convert(string) {
        return string
            .split(this.prototype._divider)
            .map((input) => input.toUpperCase())
            .join(this.prototype._joinWith);
    }
}
export class SnakeCase extends CaseStyle {
    constructor(_string, _divider = " ") {
        super(_string, _divider);
        this._string = _string;
        this._divider = _divider;
        this._joinWith = "";
    }
    convert() {
        return SnakeCase.convert(this._string);
    }
    static convert(string) {
        return string
            .split(this.prototype._divider)
            .map((input) => input.toLowerCase())
            .join(this.prototype._joinWith);
    }
}
export class CamelCase extends CaseStyle {
    constructor(_string, _divider = " ") {
        super(_string, _divider);
        this._string = _string;
        this._divider = _divider;
        this._joinWith = "";
    }
    convert() {
        return CamelCase.convert(this._string);
    }
    static convert(string) {
        return string
            .split(this.prototype._divider)
            .map((input, index) => {
            return index === 0
                ? input
                : input[0].toUpperCase() + input.slice(1);
        })
            .join(this.prototype._joinWith);
    }
}
