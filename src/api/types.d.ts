import { Router } from "express";

export type IRouteComponent = [string, Router];

export interface IRoute {
  exposeRoute(): IRouteComponent;
}
