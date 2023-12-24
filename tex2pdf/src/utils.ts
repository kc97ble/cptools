import * as fs from "fs/promises";

export async function mapValuesAsync<K, V1, V2>(
  map: Map<K, V1>,
  unary: (value: V1, key: K, map: Map<K, V1>) => Promise<V2>
): Promise<Map<K, V2>> {
  const result = new Map<K, V2>();

  await Promise.all(
    Array.from(map.entries()).map(async ([key, value]) => {
      const newValue = await unary(value, key, map);
      result.set(key, newValue);
    })
  );

  return result;
}

export async function toNameToBuffer(
  nameToPath: Map<string, string>
): Promise<Map<string, Buffer>> {
  return mapValuesAsync(nameToPath, async (pth) => await fs.readFile(pth));
}

export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
