import { Request, Response } from "express";
import { DynamoDBService } from "../service/dynamodb";
import { ItemFilter, ItemFilterDTO } from "../types/item_filters.types";
import { UserKey } from "../types/dynamodb.type";
import { randomUUID } from "crypto";
import {
  mapDTOtoFilter,
  mapItemFilterToDTO,
} from "../mappers/item_filters.mapper";
import { S3Service } from "../service/s3";

const itemFilterDDB = new DynamoDBService<ItemFilterDTO, UserKey>("user");
const itemFilterS3 = new S3Service("user-item-filters");

export async function getItemFilterList(req: Request, res: Response) {
  const user = req.user;
  const requestedUserId =
    (req.query.user_id as string | undefined) || req.user.userId;
  const isOwner = user.userId === requestedUserId;
  let filterExpression: string | undefined = undefined;

  let keyConditionExpression = `userId = :id AND begins_with(userObjectId, :prefix)`;
  const expressionValues: Record<string, any> = {
    ":id": { S: user.userId },
    ":prefix": "FILTER#",
  };

  if (!isOwner) {
    filterExpression = "public = :public";
    expressionValues[":public"] = true;
  }

  const result = await itemFilterDDB.query(
    keyConditionExpression,
    expressionValues,
    filterExpression
  );
  if (!result || result.length === 0) {
    return res.status(204).send();
  }
  return res.status(200).json(result.map((item) => mapDTOtoFilter(item)));
}

export async function getItemFilter(req: Request, res: Response) {
  const user = req.user;
  const requestedUserId =
    (req.query.user_id as string | undefined) || req.user.userId;
  const isOwner = user.userId === requestedUserId;
  const userKey: UserKey = {
    userId: requestedUserId,
    userObjectId: `FILTER#${req.params.id}`,
  };
  const result = await itemFilterDDB.get(userKey);
  if (!result) {
    return res.status(204).send();
  }
  if (!result.public && !isOwner) {
    return res.status(401).send();
  }
  return res.status(200).json(mapDTOtoFilter(result));
}

//TODO: Add functionality to delete ddb item if s3 fails for some reason
export async function putItemFilter(req: Request, res: Response) {
  const uuid = randomUUID();
  const body = req.body as ItemFilter;
  const filterKey = {
    userId: `${req.user.userId}`,
    userObjectId: `FILTER#${uuid}`,
  };
  const itemFilter: ItemFilterDTO = mapItemFilterToDTO(body, filterKey);
  const filterBuffer = Buffer.from(body.filter, "utf-8");

  await itemFilterDDB.put(itemFilter);
  await itemFilterS3.uploadTxtFile(filterBuffer, `${filterKey.userObjectId}`);

  return res.status(201).send();
}

export async function updateItemFilter(req: Request, res: Response) {
  const body = req.body as ItemFilter;
  const filterKey = {
    userId: `${req.user.userId}`,
    userObjectId: `FILTER#${req.params.id}`,
  };
  const itemFilter: Partial<ItemFilterDTO> = mapItemFilterToDTO<true>(
    body,
    undefined
  );

  const result = await itemFilterDDB.update(itemFilter, filterKey);

  if (!result) {
    return res.status(204).send();
  }

  const filterBuffer = body.filter
    ? Buffer.from(body.filter, "utf-8")
    : undefined;
  if (filterBuffer) {
    await itemFilterS3.uploadTxtFile(filterBuffer, `${filterKey.userObjectId}`);
  }

  return res.status(200).json(result);
}

export async function deleteItemFilter(req: Request, res: Response) {
  const result = await itemFilterDDB.delete({
    userId: req.user.userId,
    userObjectId: `FILTER#${req.params.id}`,
  });
  if (result) {
    await itemFilterS3.deleteFile(`${result?.userObjectId}`);
  }

  return res.status(result ? 404 : 204).send();
}
