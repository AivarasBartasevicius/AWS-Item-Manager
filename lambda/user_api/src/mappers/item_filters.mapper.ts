import { UserKey } from "../types/dynamodb.type";
import { ItemFilter, ItemFilterDTO } from "../types/item_filters.types";
import { filterOutValues } from "../utils/utils";

export function mapItemFilterToDTO<isPartial = false>(
  itemFilter: ItemFilter,
  userKey: isPartial extends true ? UserKey | undefined : UserKey
): isPartial extends true ? Partial<ItemFilterDTO> : ItemFilterDTO {
  return {
    ...userKey,
    filter_name: itemFilter.filter_name,
    realm: itemFilter.realm,
    description: itemFilter.description,
    version: itemFilter.version,
    type: itemFilter.type,
    public: itemFilter.public,
  };
}

export function mapDTOtoFilter(itemFilter: ItemFilterDTO) {
  const profile: ItemFilter = {
    ...filterOutValues<ItemFilter, keyof UserKey>(
      itemFilter,
      Object.keys(UserKey) as (keyof UserKey)[]
    ),
    id: itemFilter.userObjectId.replace("FILTER#", ""),
  };
  return profile;
}
