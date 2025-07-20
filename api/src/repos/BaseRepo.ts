import { randomUUID } from "crypto";
import { parseObject, TSchema } from "jet-validators/utils";

/**
 * Hàm parse kiểu từ db sang entity
 */
function mapToEntity<TEntity extends TSchema>(schema: TEntity) {
  return parseObject(schema, (errors) => {
    throw errors;
  });
}

/**
 * Hàm tạo uuid kiểu N
 */
function genUUID(isN: Boolean = true) {
  let uuid = randomUUID();
  if (!isN) {
    return uuid;
  }
  return uuid.replace(/-/g, "");
}

export default {
  mapToEntity,
  genUUID,
} as const;
