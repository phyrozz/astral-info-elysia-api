import { Elysia } from "elysia";
import { PostgresDBHelper } from "../../utils/postgres-db-helper";
import { Path } from "../../models/path";

export const listPath = new Elysia()
  .decorate('path', new Path())
  .post('/paths/list', async ({ set, body }) => {
    const postgresHelper = new PostgresDBHelper()
    const limit = (body as any)?.limit || 10;
    const offset = (body as any)?.offset || 0;
    const keyword = (body as any)?.keyword || '';

    set.headers['access-control-allow-origin'] = '*'

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
          WHERE pth.name ILIKE $1
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
        ORDER BY name
        LIMIT $2 OFFSET $3
      `,
      [`%${keyword}%`, limit, offset]
    );

    const count = await postgresHelper.query(
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
          WHERE pth.name ILIKE $1
          GROUP BY pth.id, pth.name 
        )
        SELECT
          COUNT(*)
        FROM path_characters
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

    // Now migrating to postgres.
    // const dynamoHelper = new DynamoHelper(process.env.TABLE!, 'ap-southeast-1');
    // const limit = (body as any)?.limit || 10;
    // const lastEvaluatedKey = (body as any)?.lastEvaluatedKey;
    // const keyword = (body as any)?.keyword || '';

    // set.headers['access-control-allow-origin'] = '*'

    // const filter = {
    //   FilterExpression: 'contains(#searchField, :searchValue)',
    //   ExpressionAttributeNames: {
    //     '#searchField': 'name'
    //   },
    //   ExpressionAttributeValues: marshall({
    //     ':searchValue': keyword
    //   })
    // };

    // const result = await dynamoHelper.scanTableWithFullFilterPage(limit, lastEvaluatedKey, keyword, filter);
    // return {
    //   data: result.items,
    //   pagination: {
    //     lastEvaluatedKey: result.lastEvaluatedKey,
    //     hasNextPage: !!result.lastEvaluatedKey
    //   }
    // };
  });