import { UserKey } from "../types/dynamodb.type";
import { ProfileDTO, Profile, PublicProfile } from "../types/profile.types";
import { pickOutValues } from "../utils/utils";

export function mapProfileToDTO<isPartial = false>(
  profile: Profile,
  userKey: isPartial extends true ? UserKey | undefined : UserKey
): isPartial extends true ? Partial<ProfileDTO> : ProfileDTO {
  const { uuid, ...filteredProfile } = profile;
  const profileDto = {
    ...userKey!,
    ...filteredProfile,
  };

  return profileDto;
}

export function mapDTOtoPublicProfile(profileDto: ProfileDTO) {
  const profile: PublicProfile = {
    ...pickOutValues<PublicProfile, PublicProfile>(
      profileDto,
      Object.keys(PublicProfile) as (keyof PublicProfile)[]
    ),
    uuid: profileDto.userObjectId.replace("PROFILE#", ""),
  };
  return profile;
}

export function mapDTOtoProfile(profileDto: ProfileDTO) {
  const { userId, userObjectId, ...filteredProfile } = profileDto;
  const profile: Profile = {
    ...filteredProfile,
    uuid: profileDto.userObjectId.replace("PROFILE#", ""),
  };
  return profile;
}
