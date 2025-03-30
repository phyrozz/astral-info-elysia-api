import { Elysia } from "elysia";
import { Type } from "../../models/type";
import { PostgresDBHelper } from "../../utils/postgres-db-helper";

export const getType = new Elysia()
  .decorate('type', new Type())
  .get('/types/get/:id', async ({ params }) => {
    const postgresHelper = new PostgresDBHelper()
    const id = params.id;

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
          WHERE t.id = $1
          GROUP BY t.id, t.name 
        )
        SELECT
          id,
          name,
          characters
        FROM type_characters
      `,
      [id]
    );

    return {
      data: result.rows[0]
    }
  });