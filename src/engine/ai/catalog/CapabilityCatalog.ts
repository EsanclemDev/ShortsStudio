import {z} from 'zod';
import {VideoSchema} from '../../director/schemas/VideoSchema';
import {entityProps} from '../../director/schemas/EntitySchema';
import {DIRECTOR_RULES} from './DirectorRules';

export function buildCapabilityCatalog() {
  const entities = Object.fromEntries(Object.entries(entityProps).map(([type, schema]) => [type, z.toJSONSchema(schema, {io: 'input'})]));
  return {catalogVersion: 1, schemaVersion: 1, videoSchema: z.toJSONSchema(VideoSchema, {io: 'input'}), entityProps: entities, rules: [...DIRECTOR_RULES]};
}
export type CapabilityCatalog = ReturnType<typeof buildCapabilityCatalog>;
