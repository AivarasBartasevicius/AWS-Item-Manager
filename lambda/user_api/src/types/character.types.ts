import { UserLeagueDataKey } from "./dynamodb.type";
import { Item } from "./item.types";

interface CharacterData {
  id: string;
  name: string;
  realm: string;
  class: string;
  level: number;
  experience: number;
  passives: number[];
  ruthless: boolean;
  deleted: boolean;
  private?: boolean;
}

interface Inventory {
  gold: number;
}

export interface Character {
  character: CharacterData;
  items?: Item[];
  inventory: Inventory;
}

export interface CharacterDTO
  extends UserLeagueDataKey,
    Omit<CharacterData, "id">,
    Inventory {}
