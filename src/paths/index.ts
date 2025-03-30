import { Elysia } from "elysia";
import { getPath } from "./get";
import { listPath } from "./list";

export const paths = new Elysia()
  .use(getPath)
  .use(listPath);