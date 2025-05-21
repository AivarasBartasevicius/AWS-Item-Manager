import { UserKey } from "./dynamodb.type";

export interface ItemFilter {
  id: string;
  filter_name: string;
  realm: string;
  description: string;
  version: string;
  type: string;
  public: boolean;
  filter: string;
}

export interface ItemFilterDTO
  extends UserKey,
    Omit<ItemFilter, "id" | "filter"> {}
