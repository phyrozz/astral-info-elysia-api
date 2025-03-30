import { Elysia } from "elysia";
import { Character } from "../../models/character";
import { PostgresDBHelper } from "../../utils/postgres-db-helper";

export const getCharacter = new Elysia()
  .decorate('character', new Character())
  .get('/characters/get/:id', async ({ params }) => {
    const postgresHelper = new PostgresDBHelper()
    const id = params.id;

    const result = await postgresHelper.query(
      `
        select
          ch.id as id,
          ch.name as name,
          p.name as path,
          t.name as type,
          ch.rarity as rarity,
          ch.release_date as release_date,
          ch.character_img as character_img,
          ch.booru_tag_name as booru_tag_name,
          JSON_BUILD_OBJECT(
            'hp', cbs.hp,
            'atk', cbs.atk,
            'def', cbs.def,
            'spd', cbs.spd,
            'taunt', cbs.taunt
          ) as base_stats
        from
          public.characters ch
          join public.paths p on ch.path_id = p.id
          join public.types t on ch.type_id = t.id
          join public.characters_base_stats_mapping cbs on ch.id = cbs.character_id
        where
          ch.id = $1
        group by
          ch.id,
          p.name,
          t.name,
          cbs.hp,
          cbs.atk,
          cbs.def,
          cbs.spd,
          cbs.taunt 
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