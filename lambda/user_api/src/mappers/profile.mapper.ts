import { UserKey } from "../types/dynamodb.type";
import { ProfileDTO, Profile, PublicProfile } from "../types/profile.types";
import { filterOutValues, pickOutValues } from "../utils/utils";

export function mapProfileToDTO<isPartial = false>(
  item: Profile,
  userKey: isPartial extends true ? UserKey | undefined : UserKey
): isPartial extends true ? Partial<ProfileDTO> : ProfileDTO {
  const dto = {
    ...userKey!,
    name: item.name,
    locale: item.locale,
    twitch: item.twitch,
    guild: item.guild,
    forumPosts: item.forumPosts,
    joined: item.joined,
    lastLoggedIn: item.lastLoggedIn,
    supporterPacks: item.supporterPacks,
    email: item.email,
    steamId: item.steamId,
    epicId: item.epicId,
    sonyId: item.sonyId,
    microsoftId: item.microsoftId,
    points: item.points,
    skins: item.skins,
  };

  return dto;
}

export function mapDTOtoPublicProfile(item: ProfileDTO) {
  const profile: PublicProfile = {
    ...pickOutValues<PublicProfile, PublicProfile>(
      item,
      Object.keys(PublicProfile) as (keyof PublicProfile)[]
    ),
    uuid: item.userObjectId.replace("PROFILE#", ""),
  };
  return profile;
}

export function mapDTOtoProfile(item: ProfileDTO) {
  const profile: Profile = {
    ...filterOutValues<Profile, keyof UserKey>(
      item,
      Object.keys(UserKey) as (keyof UserKey)[]
    ),
    uuid: item.userObjectId.replace("PROFILE#", ""),
  };
  return profile;
}
