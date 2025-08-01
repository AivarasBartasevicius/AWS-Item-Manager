import { Request, Response } from "express";
import { DynamoDBService } from "../service/dynamodb.service";
import { UserKey } from "../types/dynamodb.type";
import { randomUUID } from "crypto";
import { Profile, ProfileDTO } from "../types/profile.types";
import {
  mapDTOtoProfile,
  mapDTOtoPublicProfile,
  mapProfileToDTO,
} from "../mappers/profile.mapper";

const profileDDB = DynamoDBService.getInstance<ProfileDTO, UserKey>("user");

function getProfile(userId: string, id: string) {
  const userKey: UserKey = {
    userId: userId,
    userObjectId: `PROFILE#${id}`,
  };
  return profileDDB.get(userKey);
}

export async function getPrivateProfile(req: Request, res: Response) {
  const result = await getProfile(req.user.userId, req.params.id);
  if (!result) {
    return res.status(404).send();
  }
  return res.status(200).json(mapDTOtoProfile(result));
}

export async function getPublicProfile(req: Request, res: Response) {
  const requestedUserId =
    (req.query.user_id as string | undefined) || req.user.userId;

  const result = await getProfile(requestedUserId, req.params.id);
  if (!result) {
    return res.status(404).send();
  }
  if (result.private) {
    return res.status(403).send();
  }
  return res.status(200).json(mapDTOtoPublicProfile(result));
}

export async function putProfile(req: Request, res: Response) {
  const uuid = randomUUID();
  const body = req.body as Profile;

  const profileDTO: ProfileDTO = mapProfileToDTO(body, {
    userId: `${req.user.userId}`,
    userObjectId: `PROFILE#${req.params.id || uuid}`,
  });

  await profileDDB.put(profileDTO);
  return res.status(201).send();
}

export async function updateProfile(req: Request, res: Response) {
  const body = req.body as Profile;

  const profileDTO = mapProfileToDTO<true>(body, undefined);

  await profileDDB.update(profileDTO, {
    userId: `${req.user.userId}`,
    userObjectId: `PROFILE#${req.params.id}`,
  });
  return res.status(204).send();
}
