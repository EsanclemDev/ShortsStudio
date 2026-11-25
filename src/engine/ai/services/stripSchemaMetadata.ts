export function stripSchemaMetadata(value: unknown): unknown {
 if (value === null || typeof value !== 'object' || Array.isArray(value)) return value;
 const result = {...(value as Record<string, unknown>)};
 delete result.$schema;
 return result;
}
