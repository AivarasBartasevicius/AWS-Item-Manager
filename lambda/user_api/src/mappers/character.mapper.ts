import { Character, CharacterDTO } from "../types/character.types";
import { UserLeagueDataKey } from "../types/dynamodb.type";
import { Item, ItemDTO } from "../types/item.types";

export function mapCharacterToDTO<isPartial = false>(
  character: Character,
  key: isPartial extends true
    ? UserLeagueDataKey | undefined
    : UserLeagueDataKey
): isPartial extends true ? Partial<CharacterDTO> : CharacterDTO {
  return {
    ...key,
    name: character.character.name,
    realm: character.character.realm,
    class: character.character.class,
    level: character.character.level,
    experience: character.character.experience,
    passives: character.character.passives,
    ruthless: character.character.ruthless,
    deleted: character.character.deleted,
    gold: character.inventory.gold,
  };
}

export function DTOtoCharacter(character: CharacterDTO, items?: Item[]) {
  const profile: Character = {
    character: {
      id: character.leagueObjectId.replace("CHARACTER#", ""),
      name: character.name,
      realm: character.realm,
      class: character.class,
      level: character.level,
      experience: character.experience,
      passives: character.passives,
      ruthless: character.ruthless,
      deleted: character.deleted,
    },
    items: items,
    inventory: {
      gold: character.gold,
    },
  };
  return profile;
}
