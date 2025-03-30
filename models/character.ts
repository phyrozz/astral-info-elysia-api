import { Elysia, t } from 'elysia';

export class Character {
  constructor(
    public data: any[] = []
  ) {}

  public insertDataTypes() {
    return t.Array(
      t.Object({
        name: t.String(),
        path: t.String(),
        type: t.String(),
        rarity: t.Number(),
        releaseDate: t.String(),
        baseStats: t.Object({
          hp: t.Number(),
          atk: t.Number(),
          def: t.Number(),
          spd: t.Number(),
          taunt: t.Number()
        }),
        characterImg: t.String(),
        booruTagName: t.String(),
      })
    )
  }

  public updateDataTypes() {
    return t.Object({
      name: t.Optional(t.String()),
      path: t.Optional(t.String()),
      type: t.Optional(t.String()),
      rarity: t.Optional(t.Number()),
      releaseDate: t.Optional(t.String()),
      baseStats: t.Optional(t.Object({
        hp: t.Optional(t.Number()),
        atk: t.Optional(t.Number()),
        def: t.Optional(t.Number()),
        spd: t.Optional(t.Number()),
        taunt: t.Optional(t.Number()),
      }),),
      characterImg: t.Optional(t.String()),
      booruTagName: t.Optional(t.String()),
    })
  }
}