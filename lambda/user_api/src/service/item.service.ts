import { mapDTOtoItem, mapItemToDTO } from "../mappers/item.mapper";
import { ItemKey } from "../types/dynamodb.type";
import { Item, ItemDTO } from "../types/item.types";
import { DynamoDBService } from "./dynamodb";

export async function getItemsByLocation(
  itemDDB: DynamoDBService<ItemDTO, ItemKey>,
  locationId: string,
  consistentRead = false
) {
  const result = await itemDDB.query(`locationId = :id`, {
    ":id": locationId,
  });

  //One of the reason why Path of exile item system prob wouldn't be a good match for DynamoDB. Too many relations.
  const keys: ItemKey[] = [];
  for (const item of result) {
    if (!item.socketedItems || item.socketedItems.length === 0) {
      continue;
    }
    for (const socketedItem of item.socketedItems) {
      keys.push({ locationId: item.locationId, itemId: socketedItem });
    }
  }

  const itemsMap: { [key: string]: Item[] } = {};
  const items = await itemDDB.batchGet(keys, consistentRead);
  for (const item of items) {
    if (itemsMap[item.locationId]) {
      itemsMap[item.locationId].push(mapDTOtoItem(item));
    } else {
      itemsMap[item.locationId] = [mapDTOtoItem(item)];
    }
  }

  return result.map((item) => mapDTOtoItem(item, itemsMap[item.locationId]));
}

export async function putItems(
  itemDDB: DynamoDBService<ItemDTO, ItemKey>,
  items: Item[],
  locationId: string
) {
  const requests: {
    PutRequest: {
      Item: ItemDTO;
    };
  }[] = [];
  function pushRequest(itemDTO: ItemDTO) {
    requests.push({
      PutRequest: {
        Item: itemDTO,
      },
    });
  }
  for (const item of items) {
    pushRequest(
      mapItemToDTO(item, {
        locationId: locationId,
        itemId: item.id,
      })
    );
    if (item.socketedItems && item.socketedItems.length > 0) {
      for (const socketedItem of item.socketedItems) {
        pushRequest(
          mapItemToDTO(socketedItem, {
            locationId: `ITEM#${item.id}`,
            itemId: socketedItem.id,
          })
        );
      }
    }
  }

  await itemDDB.batchWrite(requests);
  return;
}

export const createItemService = () => {
  const itemDDB = new DynamoDBService<ItemDTO, ItemKey>("user");
  return {
    getItemsByLocation: (locationId: string, consistentRead?: boolean) =>
      getItemsByLocation(itemDDB, locationId, consistentRead),
    putItems: (items: Item[], locationId: string) =>
      putItems(itemDDB, items, locationId),
  };
};
