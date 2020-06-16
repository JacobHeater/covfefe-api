import { Router } from "express";

export interface IRoute {
  exposeRoute(): [string, Router];
}
