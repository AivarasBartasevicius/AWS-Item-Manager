import { UserLeagueDataKey } from "./dynamodb.type";
import { Item } from "./item.types";

export interface Stash {
  id: string;
  name: string;
  type: string;
  index: number;
  items?: Item[];
}

export interface StashDTO extends UserLeagueDataKey, Omit<Stash, "id"> {}
