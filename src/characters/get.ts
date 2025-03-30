import { Elysia } from "elysia";
import { Character } from "../../models/character";
import { PostgresDBHelper } from "../../utils/postgres-db-helper";

export const getCharacter = new Elysia()
  .decorate('character', new Character())
  .get('/characters/get/:id', async ({ set, params }) => {
    const postgresHelper = new PostgresDBHelper()
    const id = params.id;

    set.headers['access-control-allow-origin'] = '*'

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
        WHERE ch.id = $1 
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