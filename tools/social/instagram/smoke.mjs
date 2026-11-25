import assert from 'node:assert/strict';
import {parse,uploadURL} from './cli.mjs';
assert.equal(parse(['publish','out/test','--dry-run']).dry,true);
assert.throws(()=>parse(['publish','out/test']));
assert.throws(()=>parse(['publish','out/test','--confirm','--dry-run']));
assert.throws(()=>uploadURL('https://rupload.facebook.com.evil.test/a'));
assert.throws(()=>uploadURL('http://rupload.facebook.com/a'));
assert.equal(uploadURL('https://rupload.facebook.com/ig-api-upload/v26.0/123').hostname,'rupload.facebook.com');
console.log('Instagram contract smoke passed');
