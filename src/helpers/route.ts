import { Request } from "express";

export class Route {
  public static getPathParameterName(path: string): string[] {
    const params: string[] = [];

    path.split('/').forEach(name => {
      if (name.startsWith(':')) {
        params.push(name.substring(1));
      }
    });
    return params;
  }
  public static getPathParameterNameWithValue(path: string, requestParameter: Request["params"]): Record<string, string> {
    const params = this.getPathParameterName(path);
    const resultParameterWithValue: Record<string, string> = {};

    params.forEach(param => {
      Object.defineProperty(resultParameterWithValue, param, {
        value: requestParameter[param],
      });
    })

    return resultParameterWithValue;
  }
}
