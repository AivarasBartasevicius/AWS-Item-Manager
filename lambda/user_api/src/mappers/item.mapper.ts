import { ItemKey } from "../types/dynamodb.type";
import { Item, ItemDTO } from "../types/item.types";
import { filterOutValues } from "../utils/utils";

export function mapItemToDTO(item: Item, userKey: ItemKey): ItemDTO {
  return {
    ...filterOutValues<Omit<ItemDTO, "locationId" | "itemId">, keyof Item>(
      item,
      ["id", "socketedItems"]
    ),
    locationId: userKey.locationId,
    itemId: userKey.itemId,
    socketedItems: item.socketedItems?.map((socketedItem) => socketedItem.id), //not fond of this, but feel like it's needed to reduce reads
  };
}

export function mapDTOtoItem(item: ItemDTO, socketedItems?: Item[]) {
  const profile: Item = {
    ...filterOutValues<Omit<Item, "id" | "socketedItems">, keyof ItemDTO>(
      item,
      ["locationId", "itemId", "socketedItems"]
    ),
    id: item.itemId.replace("ITEM#", ""),
    socketedItems: socketedItems,
  };
  return profile;
}
