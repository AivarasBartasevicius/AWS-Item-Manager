import { Request, Response } from "express";
import { DynamoDBService } from "../service/dynamodb";
import { UserLeagueDataKey } from "../types/dynamodb.type";
import { createItemService } from "../service/item.service";
import { Stash, StashDTO } from "../types/stash.types";
import { mapDTOtoStash, mapStashToDTO } from "../mappers/stash.mapper";

const stashDDB = new DynamoDBService<StashDTO, UserLeagueDataKey>(
  "user_league_data"
);
const itemService = createItemService();

export async function getStashList(req: Request, res: Response) {
  const user = req.user;
  const league = req.params.league;

  const result = await stashDDB.query(
    `userLeagueId = :id AND begins_with(leagueObjectId, :prefix) `,
    {
      ":id": `${league.toUpperCase()}#${user.userId}`,
      ":prefix": "STASH#",
    }
  );
  const resultsWithItems: Stash[] = [];
  //Would need some way to identify a game server and use consistentRead = true
  for (const stash of result) {
    resultsWithItems.push(
      mapDTOtoStash(
        stash,
        await itemService.getItemsByLocation(stash.leagueObjectId)
      )
    );
  }

  if (!resultsWithItems || resultsWithItems.length === 0) {
    return res.status(404).send();
  }
  return res.status(200).json(resultsWithItems);
}

export async function getStash(req: Request, res: Response) {
  const user = req.user;
  const league = req.params.league;
  const stashId = req.params.id;
  const key: UserLeagueDataKey = {
    userLeagueId: `${league.toUpperCase()}#${user.userId}`,
    leagueObjectId: `STASH#${stashId}`,
  };

  const result = await stashDDB.get(key);

  if (!result) {
    return res.status(404).send();
  }

  //Would need some way to identify a game server and use consistentRead = true
  return res
    .status(200)
    .json(
      mapDTOtoStash(
        result,
        await itemService.getItemsByLocation(result.leagueObjectId)
      )
    );
}

export async function putStash(req: Request, res: Response) {
  const body = req.body as Stash;
  const league = req.params.league;
  const stashId = req.params.id;
  const user = req.user;

  const key: UserLeagueDataKey = {
    userLeagueId: `${league.toUpperCase()}#${user.userId}`,
    leagueObjectId: `STASH#${stashId}`,
  };

  if (body.items && body.items.length > 0) {
    await itemService.putItems(body.items, key.leagueObjectId);
  }

  const stash: StashDTO = mapStashToDTO(body, key);

  await stashDDB.put(stash);
  return res.status(201).send();
}

export async function updateStash(req: Request, res: Response) {
  const body = req.body as Stash;
  const league = req.params.league;
  const user = req.user;
  const key: UserLeagueDataKey = {
    userLeagueId: `${league.toUpperCase()}#${user.userId}`,
    leagueObjectId: `STASH#${req.params.id}`,
  };

  const stash: Partial<StashDTO> = mapStashToDTO<true>(body, undefined);

  if (body.items && body.items.length > 0) {
    await itemService.putItems(body.items, key.leagueObjectId);
  }

  await stashDDB.update(stash, key);
  return res.status(204).send();
}
