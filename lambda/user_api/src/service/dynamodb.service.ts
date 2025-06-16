import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
  BatchGetCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBItem, KeyObject } from "../types/dynamodb.type";
import { buildUpdateExpression } from "../utils/utils";

export class DynamoDBService<Item extends DynamoDBItem, Key extends KeyObject> {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private static instances: Map<string, DynamoDBService<any, any>> = new Map();

  private constructor(
    private tableName: string,
    private maxRetries: number = 3,
    region: string = "eu-north-1"
  ) {
    this.client = new DynamoDBClient({ region });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  public static getInstance<I extends DynamoDBItem, K extends KeyObject>(
    tableName: string,
    maxRetries?: number,
    region?: string
  ): DynamoDBService<I, K> {
    if (!DynamoDBService.instances.has(tableName)) {
      const newInstance = new DynamoDBService<I, K>(
        tableName,
        maxRetries,
        region
      );
      DynamoDBService.instances.set(tableName, newInstance);
    }

    return DynamoDBService.instances.get(tableName) as DynamoDBService<I, K>;
  }

  async get(key: Key): Promise<Item | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: key,
    });
    const result = await this.docClient.send(command);
    return (result.Item as Item) || null;
  }

  async put(item: Item): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });
    await this.docClient.send(command);
  }

  async update(item: Partial<Item>, key: Key): Promise<Item> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: key,
      ...buildUpdateExpression(item),
      ReturnValues: "ALL_OLD",
    });
    const result = await this.docClient.send(command);
    return (result.Attributes as Item) || null;
  }

  async delete(key: Key): Promise<Item | null> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: key,
      ReturnValues: "ALL_OLD",
    });
    const result = await this.docClient.send(command);
    return (result.Attributes as Item) || null;
  }

  async query(
    keyConditionExpression: string,
    keyExpressionValues: Record<string, any>,
    filterExpresions?: string,
    consistentRead?: boolean
  ): Promise<Item[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: keyConditionExpression,
      FilterExpression: filterExpresions,
      ExpressionAttributeValues: keyExpressionValues,
      ConsistentRead: consistentRead,
    });
    const result = await this.docClient.send(command);
    return (result.Items as Item[]) || [];
  }

  async batchGet(keys: Key[], consistentRead = false): Promise<Item[]> {
    const BATCH_SIZE = 100;
    const results: Item[] = [];

    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batchKeys = keys.slice(i, i + BATCH_SIZE);
      const command = new BatchGetCommand({
        RequestItems: {
          [this.tableName]: {
            Keys: batchKeys,
            ConsistentRead: consistentRead,
          },
        },
      });

      const response = await this.docClient.send(command);
      const items = (response.Responses?.[this.tableName] as Item[]) || [];
      results.push(...items);

      let unprocessed = response.UnprocessedKeys?.[this.tableName]?.Keys;
      let tries = 0;
      while (unprocessed && unprocessed.length > 0 && tries < this.maxRetries) {
        const retryCommand = new BatchGetCommand({
          RequestItems: {
            [this.tableName]: {
              Keys: unprocessed,
              ConsistentRead: consistentRead,
            },
          },
        });
        const retryResponse = await this.docClient.send(retryCommand);
        const retryItems =
          (retryResponse.Responses?.[this.tableName] as Item[]) || [];
        results.push(...retryItems);
        unprocessed = retryResponse.UnprocessedKeys?.[this.tableName]?.Keys;
        tries++;
      }
    }

    return results;
  }

  async batchWrite(
    requests: {
      PutRequest?: {
        Item: Item;
      };
      DeleteRequest?: {
        Key: Key;
      };
    }[]
  ): Promise<void> {
    const BATCH_SIZE = 25;
    for (let i = 0; i < requests.length; i += BATCH_SIZE) {
      const batch = requests.slice(i, i + BATCH_SIZE);
      let requestItems = {
        [this.tableName]: batch,
      };

      let response = await this.docClient.send(
        new BatchWriteCommand({ RequestItems: requestItems })
      );

      let unprocessed = response.UnprocessedItems?.[this.tableName];
      let tries = 0;
      while (unprocessed && unprocessed.length > 0 && tries < this.maxRetries) {
        const retryResponse = await this.docClient.send(
          new BatchWriteCommand({
            RequestItems: { [this.tableName]: unprocessed },
          })
        );
        unprocessed = retryResponse.UnprocessedItems?.[this.tableName];
        tries++;
      }
    }
  }
}
