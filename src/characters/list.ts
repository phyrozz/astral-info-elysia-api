import Elysia from "elysia";
import { PostgresDBHelper } from "../../utils/postgres-db-helper";
import { Character } from "../../models/character";

export const listCharacter = new Elysia()
  .decorate('character', new Character())
  .post('/characters/list', async ({ body }) => {
    const postgresHelper = new PostgresDBHelper()
    const limit = (body as any)?.limit || 10;
    const offset = (body as any)?.offset || 0;
    const keyword = (body as any)?.keyword || '';

    const result = await postgresHelper.query(
      `
        SELECT 
          ch.id as id,
          ch.name as name,
          p.name as path, 
          t.name as type,
          ch.rarity as rarity,
          ch.release_date as release_date,
          ch.character_img as character_img,
          ch.booru_tag_name as booru_tag_name
        FROM public.characters ch 
        JOIN public.paths p ON ch.path_id = p.id
        JOIN public.types t ON ch.type_id = t.id
        WHERE ch.name ILIKE $1 
        ORDER BY ch.name
        LIMIT $2 OFFSET $3
      `,
      [`%${keyword}%`, limit, offset]
    );

    const count = await postgresHelper.query(
      `
        SELECT
          COUNT(*) as count
        FROM public.characters ch
        JOIN public.paths p ON ch.path_id = p.id
        JOIN public.types t ON ch.type_id = t.id
        WHERE ch.name ILIKE $1
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