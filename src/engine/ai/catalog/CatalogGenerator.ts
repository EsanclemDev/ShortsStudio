import {buildCapabilityCatalog} from './CapabilityCatalog';
export function serializeCatalog(pretty = true): string {
  return JSON.stringify(buildCapabilityCatalog(), null, pretty ? 2 : undefined);
}
