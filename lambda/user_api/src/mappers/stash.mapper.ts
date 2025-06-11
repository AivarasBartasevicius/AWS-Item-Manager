import { UserLeagueDataKey } from "../types/dynamodb.type";
import { Item, ItemDTO } from "../types/item.types";
import { Stash, StashDTO } from "../types/stash.types";

export function mapStashToDTO<isPartial = false>(
  stash: Stash,
  key: isPartial extends true
    ? UserLeagueDataKey | undefined
    : UserLeagueDataKey
): isPartial extends true ? Partial<StashDTO> : StashDTO {
  const { id, ...filteredProfile } = stash;
  return {
    ...filteredProfile,
    ...key,
  };
}

export function mapDTOtoStash(stashDto: StashDTO, items?: Item[]) {
  const { userLeagueId, leagueObjectId, ...filteredStash } = stashDto;
  const stash: Stash = {
    ...filteredStash,
    id: stashDto.leagueObjectId.replace("STASH#", ""),
    items: items,
  };
  return stash;
}
