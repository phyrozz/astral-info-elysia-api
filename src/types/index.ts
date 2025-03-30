import { Elysia } from "elysia";
import { getType } from "./get";
import { listType } from "./list";

export const types = new Elysia()
  .use(getType)
  .use(listType);