export function pickOutValues<Item, Keys>(
  obj: Record<string, any>,
  keys: (keyof Keys)[]
): Item {
  for (const key in obj) {
    if (!keys.includes(key as keyof Keys)) {
      delete obj[key];
    }
  }
  return obj as Item;
}

export function filterOutValues<Item, Key>(
  obj: Record<string, any>,
  keys: Key[]
): Item {
  for (const key in obj) {
    if (keys.includes(key as Key)) {
      delete obj[key];
    }
  }
  return obj as Item;
}

type UpdateExpressionParts = {
  UpdateExpression: string;
  ExpressionAttributeValues: Record<string, any>;
};

export function buildUpdateExpression(
  item: Record<string, any>
): UpdateExpressionParts {
  const updates: string[] = [];
  const values: Record<string, any> = {};
  for (const [k, v] of Object.entries(item)) {
    const placeholder = `:${k}`;
    updates.push(`${k} = ${placeholder}`);
    values[placeholder] = v;
  }

  return {
    UpdateExpression: `set ${updates.join(", ")}`,
    ExpressionAttributeValues: values,
  };
}
