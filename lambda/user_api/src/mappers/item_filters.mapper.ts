import { UserKey } from "../types/dynamodb.type";
import {
  ItemFilter,
  ItemFilterDTO,
  ItemFilterResponse,
} from "../types/item_filters.types";

export function mapItemFilterToDTO<isPartial = false>(
  itemFilter: ItemFilter,
  userKey: isPartial extends true ? UserKey | undefined : UserKey
): isPartial extends true ? Partial<ItemFilterDTO> : ItemFilterDTO {
  const { id, filter, ...filteredItemFiler } = itemFilter;

  return {
    ...userKey,
    ...filteredItemFiler,
  };
}

//The filter file download would be handled by the client instead of adding extra execution time downloading it here, so we just return
export function mapDTOtoFilter(itemFilter: ItemFilterDTO): ItemFilterResponse {
  const { userId, userObjectId, ...filteredItemFiler } = itemFilter;
  const itemFilters: ItemFilterResponse = {
    ...filteredItemFiler,
    id: itemFilter.userObjectId.replace("FILTER#", ""),
  };
  return itemFilters;
}
