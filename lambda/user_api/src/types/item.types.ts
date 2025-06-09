import { ItemKey } from "./dynamodb.type";

interface ItemProperty {
  name: string;
  values: [string, number][];
  displayMode: number;
  type?: number;
  suffix?: string;
  progress?: number;
}

interface Socket {
  group: number;
  attr: string;
  sColour: string;
}

export interface Item {
  id: string;
  verified: boolean;
  stackSize?: number;
  maxStackSize?: number;
  stackSizeText?: string;
  w: number;
  h: number;
  icon: string;
  league: string;
  name: string;
  typeLine: string;
  baseType: string;
  rarity: string;
  ilvl?: number;
  identified?: boolean;
  searing?: boolean;
  tangled?: boolean;
  support?: boolean;
  corrupted?: boolean;
  properties?: ItemProperty[];
  additionalProperties?: ItemProperty[];
  requirements?: ItemProperty[];
  implicitMods?: string[];
  explicitMods?: string[];
  craftedMods?: string[];
  enchantMods?: string[];
  utilityMods?: string[];
  frameType: number;
  x: number;
  y: number;
  inventoryId: string;
  sockets?: Socket[];
  socketedItems?: Omit<Item, "socketedItems">[];
}

export interface ItemDTO extends ItemKey, Omit<Item, "socketedItems" | "id"> {
  socketedItems?: string[];
}
