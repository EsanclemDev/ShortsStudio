import assert from 'node:assert/strict';
import {chunks,challenge,parseArgs,uploadUrl,resumeIndex,canRetry} from './contract';
assert.deepEqual(chunks(10681894),{size:10681894,count:1});assert.deepEqual(chunks(70000001),{size:32000000,count:2});assert.throws(()=>chunks(0));assert.equal(challenge('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');assert.throws(()=>parseArgs(['publish','out/test']));assert.throws(()=>parseArgs(['publish','out/test','--confirm','--dry-run']));assert.equal(parseArgs(['publish','out/test','--dry-run']).dry,true);console.log('TikTok contract smoke OK');

assert.equal(uploadUrl('https://open-upload-i18n.tiktokapis.com/path?secret=x').hostname,'open-upload-i18n.tiktokapis.com');
for(const u of ['http://open-upload-i18n.tiktokapis.com','https://open-upload-i18n.tiktokapis.com.evil.test','https://user@open-upload-i18n.tiktokapis.com','https://open-upload-i18n.tiktokapis.com:444'])assert.throws(()=>uploadUrl(u));
assert.equal(resumeIndex(32000000,70000001,32000000,2),1);assert.throws(()=>resumeIndex(1,70000001,32000000,2));assert.throws(()=>resumeIndex(70000001,70000001,32000000,2));assert.equal(canRetry('FAILED'),true);assert.equal(canRetry('PROCESSING_UPLOAD'),false);assert.equal(parseArgs(['resume','out/test','--confirm']).cmd,'resume');assert.throws(()=>parseArgs(['retry','out/test']));
console.log('TikTok recovery smoke OK');
