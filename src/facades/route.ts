import { NextFunction, Request, Response, Router } from "express";
import { Helpers } from "../helpers/route";
import { Utils } from "../utils/get-argument-name";

interface Type<T> extends Function { new(...args: any[]): T };
type Key<T> = keyof T;

export class Route {
  private static router: Router
  private static registeredRoutes: [string, [string, string]][] = [];

  public static setRouter(router: Router) {
    this.router = router;
  }
  public static getAllRegisteredRoutes() {
    return this.registeredRoutes;
  }
  private static registerRoute<A extends Record<string, any>>(path: string, controller: [Type<A>, Key<A>]) {
    this.registeredRoutes.push([path, [controller[0].name, controller[1] as string]]);
  }
  private static middleware<A extends Record<string, any>>(path: string, controller: [Type<A>, Key<A>]) {
    const controllerClass = new controller[0];
    const controllerMethod = controllerClass[controller[1]];

    return function (request: Request, response: Response, next: NextFunction) {
      const keyValue = Helpers.Route.getPathParameterNameWithValue(path, request.params);
      const functionArgs = Utils.getArgumentName(controllerMethod).slice(1); // Ignore the first parameter because it is the express request, passing them manually.

      const value = functionArgs.map((argument) => {
        return keyValue[argument];
      }).filter((val) => {
        return val;
      });

      return controllerMethod.apply(null, [...value]);
    }
  }

  public static get<A extends Record<string, any>>(path: string, controller: [Type<A>, Key<A>]) {
    this.registerRoute(path, controller);

    return this.router.get(path, this.middleware(path, controller));
  }
  public static post<A extends Record<string, any>>(path: string, controller: [Type<A>, Key<A>]) {
    this.registerRoute(path, controller);

    return this.router.post(path, this.middleware(path, controller));
  }
  public static put<A extends Record<string, any>>(path: string, controller: [Type<A>, Key<A>]) {
    this.registerRoute(path, controller);

    return this.router.put(path, this.middleware(path, controller));
  }
  public static patch<A extends Record<string, any>>(path: string, controller: [Type<A>, Key<A>]) {
    this.registerRoute(path, controller);

    return this.router.patch(path, this.middleware(path, controller));
  }
  public static delete<A extends Record<string, any>>(path: string, controller: [Type<A>, Key<A>]) {
    this.registerRoute(path, controller);

    return this.router.delete(path, this.middleware(path, controller));
  }

}