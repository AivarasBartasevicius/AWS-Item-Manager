import { Request, Response } from "express";
import { DynamoDBService } from "../service/dynamodb";
import { UserLeagueDataKey } from "../types/dynamodb.type";
import { Character, CharacterDTO } from "../types/character.types";
import { DTOtoCharacter, mapCharacterToDTO } from "../mappers/character.mapper";
import { getItemsByLocation, putItems } from "../service/item.service";

const characterDDB = new DynamoDBService<CharacterDTO, UserLeagueDataKey>(
  "user"
);

export async function getCharacterList(req: Request, res: Response) {
  const user = req.user;
  const requestedUserId =
    (req.query.user_id as string | undefined) || req.user.userId;
  const isOwner = user.userId === requestedUserId;
  const league = req.params.league;

  const result = await characterDDB.query(
    `userLeagueId = :id AND begins_with(leagueObjectId, :prefix) `,
    {
      ":id": { S: `${league.toUpperCase()}#${requestedUserId}` },
      ":prefix": "CHARACTER#",
    }
  );
  const filteredResults = result.filter((item) => isOwner || !item.private);

  if (!filteredResults || filteredResults.length === 0) {
    return res.status(204).send();
  }
  return res
    .status(200)
    .json(filteredResults.map((item) => DTOtoCharacter(item)));
}

export async function getCharacter(req: Request, res: Response) {
  const requestedUserId =
    (req.query.user_id as string | undefined) || req.user.userId;
  const league = req.params.league;
  const user = req.user;
  const isOwner = user.userId === requestedUserId;
  const key: UserLeagueDataKey = {
    userLeagueId: `${league.toUpperCase()}#${requestedUserId}`,
    leagueObjectId: `CHARACTER#${requestedUserId}`,
  };

  const result = await characterDDB.get(key);

  if (!result) {
    return res.status(204).send();
  }
  if (!isOwner || result.private) {
    return res.status(401).send();
  }

  //Would need some way to identify a game server and use consistentRead = true
  return res
    .status(200)
    .json(DTOtoCharacter(result, await getItemsByLocation(key.leagueObjectId)));
}

export async function putCharacter(req: Request, res: Response) {
  const body = req.body as Character;
  const league = req.params.league;
  const user = req.user;

  const key: UserLeagueDataKey = {
    userLeagueId: `${league.toUpperCase()}#${user.userId}`,
    leagueObjectId: `CHARACTER#${req.params.id}`,
  };

  if (body.items && body.items.length > 0) {
    await putItems(body.items, key.leagueObjectId);
  }

  const character: CharacterDTO = mapCharacterToDTO(body, key);

  await characterDDB.put(character);
  return res.status(req.params.userId ? 204 : 201).send();
}

export async function updateCharacter(req: Request, res: Response) {
  const body = req.body as Character;
  const league = req.params.league;
  const user = req.user;
  const key: UserLeagueDataKey = {
    userLeagueId: `${league.toUpperCase()}#${user.userId}`,
    leagueObjectId: `CHARACTER#${req.params.id}`,
  };

  const character: Partial<CharacterDTO> = mapCharacterToDTO<true>(
    body,
    undefined
  );

  if (body.items && body.items.length > 0) {
    await putItems(body.items, key.leagueObjectId);
  }

  await characterDDB.update(character, key);
  return res.status(req.params.userId ? 204 : 201).send();
}

//TODO: Probably need to add filter on "delete" field to on GET requests because of this
export async function disableCharacter(req: Request, res: Response) {
  const league = req.params.league;
  const user = req.user;
  const key: UserLeagueDataKey = {
    userLeagueId: `${league.toUpperCase()}#${user.userId}`,
    leagueObjectId: `CHARACTER#${req.params.id}`,
  };

  const result = await characterDDB.update({ deleted: true }, key);

  return res.status(result ? 404 : 204).send();
}
