import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { listFiles, crc32 } from '../../tools/package-dev.mjs';
import { packageStore } from '../../tools/package-store.mjs';
import { GENERATOR as SCREENSHOT_GENERATOR } from '../../tools/webstore-screenshots.mjs';
import { prepareStore, parseCheckEvidence, parseArgs } from '../../tools/webstore-prepare.mjs';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const PASS='✓ Apex AdBlocker załadowany w Chromium: service worker działa, health bez ERROR';
const SKIP='SKIP: Chromium smoke test unavailable (Chromium is missing)';
function result({tests=5,passed=5,failed=0,skipped=0,cancelled=0,todo=0,smoke=PASS,status=0,failures}={}) {
  return {status,stdout:`TAP version 13\nok 1 - a test\n# tests ${tests}\n# pass ${passed}\n# fail ${failed}\n# cancelled ${cancelled}\n# skipped ${skipped}\n# todo ${todo}\n${smoke}\n${failures?`✗ Niepowodzenie: ${failures}\n`:''}`,stderr:''};
}
function png(width,height) {
 const chunk=(name,data)=>{const b=Buffer.concat([Buffer.from(name),data]),r=Buffer.alloc(12+data.length);r.writeUInt32BE(data.length);b.copy(r,4);r.writeUInt32BE(crc32(b),8+data.length);return r};
 const header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(Buffer.alloc((width*4+1)*height))),chunk('IEND',Buffer.alloc(0))]);
}
function fixture() {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'apex-prepare-'));
 for(const dir of ['icons','rules','data','scriptlets','shared','docs/webstore','dist'])fs.mkdirSync(path.join(root,dir),{recursive:true});
 const manifest={manifest_version:3,name:'Fixture',description:'Store fixture',version:'1.0.0',permissions:['storage'],host_permissions:['<all_urls>'],background:{type:'module',service_worker:'background.js'},icons:{128:'icons/icon128.png'},declarative_net_request:{rule_resources:[{id:'ads',enabled:true,path:'rules/ads.json'}]}};
 for(const [file,bytes]of Object.entries({'manifest.json':JSON.stringify(manifest),'background.js':'// actual worker','rules/ads.json':'[]','data/ads.scriptlets.json':JSON.stringify([{file:'scriptlets/ads-0.js',jsBefore:['shared/helper.js']}]),'scriptlets/ads-0.js':'// actual scriptlet','shared/helper.js':'// prerequisite','docs/webstore/listing.md':'Listing draft','dist/user-note.txt':'must survive'}))fs.writeFileSync(path.join(root,file),bytes);
 fs.writeFileSync(path.join(root,'icons/icon128.png'),png(128,128));
 fs.writeFileSync(path.join(root,'docs/webstore/promo.png'),png(440,280));
 const submission={publisher:{name:'Author',contactEmail:'support@publisher.dev',privacyPolicyUrl:'https://publisher.dev/privacy'},materials:{listings:['docs/webstore/listing.md'],promotionalImage:'docs/webstore/promo.png',screenshots:[]},userNote:'preserve'};
 fs.writeFileSync(path.join(root,'docs/webstore/submission.json'),JSON.stringify(submission));
 return {root,submission,cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
}
function contentsHash(dir){const h=crypto.createHash('sha256');for(const f of listFiles(dir))h.update(f).update('\0').update(fs.readFileSync(path.join(dir,f))).update('\0');return h.digest('hex')}
async function validCapture({extensionDir,outDir}){
 fs.mkdirSync(outDir,{recursive:true});
 const bytes=png(1280,800);fs.writeFileSync(path.join(outDir,'shot.png'),bytes);
 const metadata={generator:SCREENSHOT_GENERATOR,provenance:'actual-extension-in-temporary-profile',mockedChromeApi:false,extensionVersion:'1.0.0',sourceContentsSha256:contentsHash(extensionDir),images:[{file:'shot.png',width:1280,height:800,sha256:hash(bytes)}]};
 fs.writeFileSync(path.join(outDir,'metadata.json'),JSON.stringify(metadata));
 return metadata;
}

test('prepare parses the final anchored summary and actual smoke line, never test titles',()=>{
 const r=result();r.stdout='# tests 999\n# pass 999\nok 2 - '+PASS+'\n'+r.stdout;
 const evidence=parseCheckEvidence(r);
 assert.equal(evidence.tests,5);assert.equal(evidence.passed,5);assert.equal(evidence.smoke,'PASS');assert.equal(evidence.completePass,true);
 const titleOnly=parseCheckEvidence({...result(),stdout:result().stdout.replace(PASS,'ok 9 - '+PASS)});
 assert.equal(titleOnly.smoke,'NOT_RUN');assert.equal(titleOnly.completePass,false);assert.equal(titleOnly.actualFailure,true);
});

test('prepare distinguishes blocked browser checks from genuine test/build failures and missing results',()=>{
 const blocked=parseCheckEvidence(result({tests:511,passed:491,skipped:20,smoke:SKIP,status:1,failures:'tests, chromium-smoke-required'}));
 assert.equal(blocked.smoke,'SKIP');assert.equal(blocked.actualFailure,false);assert.equal(blocked.completePass,false);
 assert.equal(parseCheckEvidence(result({tests:5,passed:4,failed:1,status:1,failures:'tests'})).actualFailure,true);
 assert.equal(parseCheckEvidence(result({tests:5,passed:4,skipped:1,status:1,smoke:SKIP,failures:'build, tests, chromium-smoke-required'})).actualFailure,true);
 assert.equal(parseCheckEvidence(result({tests:8,passed:5,skipped:1,smoke:SKIP,status:1})).actualFailure,true,'inconsistent summary is not pending browser evidence');
 const missing=parseCheckEvidence({status:1,stdout:'setup error'});assert.equal(missing.tests,null);assert.equal(missing.actualFailure,true);
});

test('prepare builds a real fresh ZIP, records blocked checks, preserves publisher and unrelated outputs, and never captures without smoke',async()=>{
 const f=fixture();
 try{
  const previousEvidence={custom:'keep this original',liveSites:{status:'PASS',tested:3,failed:0}};
  fs.writeFileSync(path.join(f.root,'docs/webstore/validation-evidence.json'),JSON.stringify(previousEvidence));
  fs.writeFileSync(path.join(f.root,'docs/webstore/readiness-report.json'),'old report');
  fs.mkdirSync(path.join(f.root,'dist/webstore-validation'));fs.writeFileSync(path.join(f.root,'dist/webstore-validation/check.log'),'old custom log');
  let captureCalls=0;
  const r=await prepareStore({root:f.root,runCheck:async()=>result({tests:511,passed:491,skipped:20,smoke:SKIP,status:1,failures:'tests, chromium-smoke-required'}),capture:async()=>{captureCalls++;throw new Error('must not capture')}});
  assert.equal(captureCalls,0);assert.equal(r.exitCode,2);assert.equal(r.technical.ok,true);assert.equal(r.publicationReady,false);
  assert.equal(fs.readFileSync(path.join(f.root,'dist/user-note.txt'),'utf8'),'must survive');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.root,'docs/webstore/submission.json'))),f.submission);
  const evidence=JSON.parse(fs.readFileSync(path.join(f.root,r.evidenceFile)));assert.equal(evidence.browser.skipped,20);assert.equal(evidence.browser.smoke,'SKIP');assert.equal(evidence.liveSites.status,'not_run');
  assert.equal(hash(fs.readFileSync(path.join(f.root,r.package.path))),evidence.packageSha256);
  assert.equal(JSON.parse(fs.readFileSync(path.join(f.root,r.previousOutputsBackupDir,'previous-validation-evidence.json'))).custom,previousEvidence.custom);
  assert.equal(fs.readFileSync(path.join(f.root,r.previousOutputsBackupDir,'previous-readiness-report.json'),'utf8'),'old report');
  assert.equal(fs.readFileSync(path.join(f.root,r.previousOutputsBackupDir,'previous-check.log'),'utf8'),'old custom log');
 }finally{f.cleanup()}
});

test('prepare populates verified captures after smoke PASS and keeps publisher/privacy fields intact',async()=>{
 const f=fixture();try{
  const r=await prepareStore({root:f.root,runCheck:async()=>result(),capture:validCapture});
  assert.equal(r.screenshots.status,'PASS');assert.equal(r.screenshots.images,1);
  const submission=JSON.parse(fs.readFileSync(path.join(f.root,'docs/webstore/submission.json')));
  assert.deepEqual(submission.publisher,f.submission.publisher);assert.equal(submission.userNote,'preserve');
  assert.equal(submission.materials.promotionalImage,f.submission.materials.promotionalImage);
  assert.equal(submission.materials.screenshots[0].actualExtensionCapture,true);
  assert.equal(r.exitCode,2,'real-site evidence is not manufactured by successful UI capture');
  assert.ok(r.blockers.some(x=>/real-site/.test(x)));
 }finally{f.cleanup()}
});

test('prepare rejects synthetic or stale screenshot metadata and preserves existing submission data',async()=>{
 for(const invalid of ['synthetic','stale']){
  const f=fixture();try{
   const r=await prepareStore({root:f.root,runCheck:async()=>result(),capture:async(opts)=>{
    const metadata=await validCapture(opts);
    if(invalid==='synthetic')metadata.mockedChromeApi=true;else metadata.sourceContentsSha256='stale';
    return metadata;
   }});
   assert.equal(r.screenshots.status,'FAIL');assert.equal(r.publicationReady,false);
   assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.root,'docs/webstore/submission.json'))),f.submission);
  }finally{f.cleanup()}
 }
});

test('prepare returns a technical failure for broken tests or a package stale relative to current source',async()=>{
 for(const mutate of [false,true]){
  const f=fixture();try{
   const r=await prepareStore({root:f.root,capture:validCapture,runCheck:async()=>{
    if(mutate)fs.appendFileSync(path.join(f.root,'background.js'),'\n// changed during check');
    return mutate?result():result({tests:5,passed:4,failed:1,smoke:SKIP,status:1,failures:'tests, chromium-smoke-required'});
   }});
   assert.equal(r.exitCode,1);assert.equal(r.publicationReady,false);
   if(mutate)assert.equal(r.technical.ok,false);
  }finally{f.cleanup()}
 }
});

test('prepare only reuses explicitly requested live-site evidence matching this exact ZIP',async()=>{
 for(const matching of [false,true]){
  const f=fixture();try{
   const p=packageStore({root:f.root,outDir:path.join(f.root,'dist/previous-package')});
   const reusePath=path.join(f.root,'previous-evidence.json');
   fs.writeFileSync(reusePath,JSON.stringify({packageSha256:matching?hash(fs.readFileSync(p.zipPath)):'stale',liveSites:{status:'PASS',tested:3,failed:0}}));
   const r=await prepareStore({root:f.root,reuseLiveEvidencePath:reusePath,runCheck:async()=>result(),capture:validCapture});
   assert.equal(r.exitCode,matching?0:2);assert.equal(r.publicationReady,matching);
  }finally{f.cleanup()}
 }
});

test('prepare CLI has explicit paths and rejects unknown/incomplete options',()=>{
 assert.deepEqual(parseArgs(['--help']),{help:true});
 assert.equal(parseArgs(['--submission','/tmp/submission.json']).submissionPath,'/tmp/submission.json');
 assert.throws(()=>parseArgs(['--upload']),/Unknown/);assert.throws(()=>parseArgs(['--root']),/incomplete/);
});
