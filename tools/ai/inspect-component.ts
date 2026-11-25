import {readFileSync} from 'node:fs';
import {inspectComponent} from '../../src/engine/components/ComponentNormalizer';
const [component,animation]=process.argv.slice(2);if(!component)throw new Error('Usage: inspect-component.ts component.json [animation.json]');console.log(JSON.stringify(inspectComponent(JSON.parse(readFileSync(component,'utf8')),animation?JSON.parse(readFileSync(animation,'utf8')):undefined),null,2));
