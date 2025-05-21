import { UserLeagueDataKey } from "../types/dynamodb.type";
import { Item, ItemDTO } from "../types/item.types";
import { Stash, StashDTO } from "../types/stash.types";
import { filterOutValues } from "../utils/utils";

export function mapStashToDTO<isPartial = false>(
  stash: Stash,
  key: isPartial extends true
    ? UserLeagueDataKey | undefined
    : UserLeagueDataKey
): isPartial extends true ? Partial<StashDTO> : StashDTO {
  return {
    ...filterOutValues<
      Omit<StashDTO, "userLeagueId" | "leagueObjectId">,
      keyof Stash
    >(stash, ["id"]),
    ...key,
  };
}

export function mapDTOtoStash(stash: StashDTO, items?: Item[]) {
  const profile: Stash = {
    ...filterOutValues<Omit<Stash, "id" | "items">, keyof StashDTO>(stash, [
      "userLeagueId",
      "leagueObjectId",
      "items",
    ]),
    id: stash.leagueObjectId.replace("STASH#", ""),
    items: items,
  };
  return profile;
}
