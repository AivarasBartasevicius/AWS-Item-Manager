import { ItemKey } from "../types/dynamodb.type";
import { Item, ItemDTO } from "../types/item.types";

export function mapItemToDTO(item: Item, userKey: ItemKey): ItemDTO {
  const { id, socketedItems, ...filteredItems } = item;
  return {
    ...filteredItems,
    ...userKey,
    socketedItems: item.socketedItems?.map((socketedItem) => socketedItem.id), //not fond of this, but feel like it's needed to reduce reads
  };
}

export function mapDTOtoItem(itemDto: ItemDTO, socketedItems?: Item[]) {
  const { locationId, itemId, ...filteredItems } = itemDto;
  const item: Item = {
    ...filteredItems,
    id: itemDto.itemId.replace("ITEM#", ""),
    socketedItems: socketedItems,
  };
  return item;
}
