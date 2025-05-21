import { UserKey } from "./dynamodb.type";

export class PublicProfile {
  uuid: string;
  name: string;
  locale: string;
  twitch?: string;
  guild: string;
  forumPosts: number;
  joined: Date;
  lastLoggedIn: Date;
  supporterPacks?: string[];
  private?: boolean;
}

export interface Profile extends PublicProfile {
  email: string;
  steamId?: string;
  epicId?: string;
  sonyId?: string;
  microsoftId?: string;
  points: number;
  skins: string[];
}

export interface ProfileDTO extends UserKey, Omit<Profile, "uuid"> {}
