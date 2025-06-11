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

export function DTOtoCharacter(characterDto: CharacterDTO, items?: Item[]) {
  const character: Character = {
    character: {
      id: characterDto.leagueObjectId.replace("CHARACTER#", ""),
      name: characterDto.name,
      realm: characterDto.realm,
      class: characterDto.class,
      level: characterDto.level,
      experience: characterDto.experience,
      passives: characterDto.passives,
      ruthless: characterDto.ruthless,
      deleted: characterDto.deleted,
    },
    items: items,
    inventory: {
      gold: characterDto.gold,
    },
  };
  return character;
}
