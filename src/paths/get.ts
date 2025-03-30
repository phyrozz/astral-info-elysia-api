import { Elysia } from "elysia";
import { Path } from "../../models/path";
import { PostgresDBHelper } from "../../utils/postgres-db-helper";

export const getPath = new Elysia()
  .decorate('path', new Path())
  .get('/paths/get/:id', async ({ params }) => {
    const postgresHelper = new PostgresDBHelper()
    const id = params.id;

    const result = await postgresHelper.query(
      `
        WITH path_characters AS (
          SELECT 
            pth.id as id,
            pth.name as name,
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ch.id,
                'name', ch.name
              )
            ) AS characters
          FROM public.paths pth
          LEFT JOIN public.characters ch
            ON pth.id = ch.path_id
          WHERE pth.id = $1
          GROUP BY pth.id, pth.name 
        )
        SELECT
          id,
          name,
          characters,
          CASE 
            WHEN (characters -> 0 ->> 'id') IS NULL THEN 0
            ELSE 1
          END AS is_playable
        FROM path_characters
      `,
      [id]
    );

    return {
      data: result.rows[0]
    }

    // const dynamoHelper = new DynamoHelper(process.env.TABLE!, 'ap-southeast-1');
    
    // set.headers['access-control-allow-origin'] = '*'

    // const { id } = params;
    // const character = await dynamoHelper.getItem(parseInt(id));
    // return { data: character };
  });