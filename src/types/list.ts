import { Elysia } from "elysia";
import { PostgresDBHelper } from "../../utils/postgres-db-helper";
import { Type } from "../../models/type";

export const listType = new Elysia()
  .decorate('type', new Type())
  .post('/types/list', async ({ body }) => {
    const postgresHelper = new PostgresDBHelper()
    const limit = (body as any)?.limit || 10;
    const offset = (body as any)?.offset || 0;
    const keyword = (body as any)?.keyword || '';

    const result = await postgresHelper.query(
      `
        WITH type_characters AS (
          SELECT 
            t.id as id,
            t.name as name,
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ch.id,
                'name', ch.name
              )
            ) AS characters
          FROM public.types t
          LEFT JOIN public.characters ch
            ON t.id = ch.type_id
          WHERE t.name ILIKE $1
          GROUP BY t.id, t.name 
        )
        SELECT
          id,
          name,
          characters
        FROM type_characters
        ORDER BY name
        LIMIT $2 OFFSET $3
      `,
      [`%${keyword}%`, limit, offset]
    );

    const count = await postgresHelper.query(
      `
        WITH type_characters AS (
          SELECT 
            t.id as id,
            t.name as name,
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ch.id,
                'name', ch.name
              )
            ) AS characters
          FROM public.types t
          LEFT JOIN public.characters ch
            ON t.id = ch.type_id
          WHERE t.name ILIKE $1
          GROUP BY t.id, t.name 
        )
        SELECT
          COUNT(*)
        FROM type_characters
      `,
      [`%${keyword}%`]
    );

    return {
      data: result.rows,
      count: parseInt(count.rows[0].count),
      pagination: {
        limit: limit,
        offset: offset
      }
    }
  });