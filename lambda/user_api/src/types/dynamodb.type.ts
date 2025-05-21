export type DynamoDBItem = Record<string, any>;

export type KeyObject = Record<string, any>;

export class ItemKey {
  locationId: string;
  itemId: string;
}

export class UserKey {
  userId: string;
  userObjectId: string;
}

export class UserLeagueDataKey {
  userLeagueId: string;
  leagueObjectId: string;
}
