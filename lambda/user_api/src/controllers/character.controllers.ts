import { NextFunction, Request, Response } from "express";
import { DynamoDBService } from "../service/dynamodb.service";
import { UserLeagueDataKey } from "../types/dynamodb.type";
import { Character, CharacterDTO } from "../types/character.types";
import { DTOtoCharacter, mapCharacterToDTO } from "../mappers/character.mapper";
import { createItemService } from "../service/item.service";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../middleware/req_errors/req_errors";

const characterDDB = DynamoDBService.getInstance<
  CharacterDTO,
  UserLeagueDataKey
>("user_league_data");
const itemService = createItemService();

//TODO: create validations instead of duplicating ifs

export async function getCharacterList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const requestedUserId =
      (req.query.user_id as string | undefined) || req.user.userId;
    const isOwner = user.userId === requestedUserId;
    const league = req.params.league;

    if (!league) {
      return next(new BadRequestError("League parameter is missing."));
    }

    const result = await characterDDB.query(
      `userLeagueId = :id AND begins_with(leagueObjectId, :prefix) `,
      {
        ":id": `${league.toUpperCase()}#${requestedUserId}`,
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
  } catch (error) {
    next(error);
  }
}

export async function getCharacter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const requestedUserId =
      (req.query.user_id as string | undefined) || req.user.userId;
    const characterId = req.params.id;
    const league = req.params.league;
    const user = req.user;
    const isOwner = user.userId === requestedUserId;

    if (!league) {
      return next(new BadRequestError("League parameter is missing."));
    }
    if (!characterId) {
      return next(
        new BadRequestError("Character ID is missing from parameters.")
      );
    }

    const key: UserLeagueDataKey = {
      userLeagueId: `${league.toUpperCase()}#${requestedUserId}`,
      leagueObjectId: `CHARACTER#${characterId}`,
    };

    const result = await characterDDB.get(key);

    if (!result) {
      return next(new NotFoundError("Character not found."));
    }
    if (!isOwner || result.private) {
      return next(
        new UnauthorizedError(
          "You are not authorized to view this private character."
        )
      );
    }

    //Would need some way to identify a game server and use consistentRead = true
    return res
      .status(200)
      .json(
        DTOtoCharacter(
          result,
          await itemService.getItemsByLocation(key.leagueObjectId)
        )
      );
  } catch (error) {
    next(error);
  }
}

export async function putCharacter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body as Character;
    const league = req.params.league;
    const user = req.user;
    const characterId = req.params.id;

    if (!league) {
      return next(new BadRequestError("League parameter is missing."));
    }
    if (!characterId) {
      return next(
        new BadRequestError("Character ID is missing from parameters.")
      );
    }

    const key: UserLeagueDataKey = {
      userLeagueId: `${league.toUpperCase()}#${user.userId}`,
      leagueObjectId: `CHARACTER#${characterId}`,
    };

    if (body.items && body.items.length > 0) {
      await itemService.putItems(body.items, key.leagueObjectId);
    }

    const character: CharacterDTO = mapCharacterToDTO(body, key);

    await characterDDB.put(character);
    return res.status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function updateCharacter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body as Character;
    const league = req.params.league;
    const characterId = req.params.league;
    const user = req.user;

    if (!league) {
      return next(new BadRequestError("League parameter is missing."));
    }
    if (!characterId) {
      return next(
        new BadRequestError("Character ID is missing from parameters.")
      );
    }

    const key: UserLeagueDataKey = {
      userLeagueId: `${league.toUpperCase()}#${user.userId}`,
      leagueObjectId: `CHARACTER#${characterId}`,
    };

    const character: Partial<CharacterDTO> = mapCharacterToDTO<true>(
      body,
      undefined
    );

    if (body.items && body.items.length > 0) {
      await itemService.putItems(body.items, key.leagueObjectId);
    }

    await characterDDB.update(character, key);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function disableCharacter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const league = req.params.league;
    const characterId = req.params.league;
    const user = req.user;

    if (!league) {
      return next(new BadRequestError("League parameter is missing."));
    }
    if (!characterId) {
      return next(
        new BadRequestError("Character ID is missing from parameters.")
      );
    }

    const key: UserLeagueDataKey = {
      userLeagueId: `${league.toUpperCase()}#${user.userId}`,
      leagueObjectId: `CHARACTER#${characterId}`,
    };

    const result = await characterDDB.update({ deleted: true }, key);

    return res.status(result ? 404 : 204).send();
  } catch (error) {
    next(error);
  }
}
