import { Elysia } from "elysia";
import { getCharacter } from "./get";
import { listCharacter } from "./list";

export const characters = new Elysia()
  .use(getCharacter)
  .use(listCharacter);