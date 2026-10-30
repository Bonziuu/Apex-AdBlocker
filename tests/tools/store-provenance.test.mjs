import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { contentsHash, captureMetadata, publishAssets, sha256 } from '../../store/tools/provenance.mjs';
import { generateStoreAssets } from '../../store/generate.mjs';
import { ROOT } from '../../tools/package-dev.mjs';

function fixture() {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'apex-store-provenance-'));
  const source=path.join(root,'source'),staged=path.join(root,'staged'),out=path.join(root,'out'),backup=path.join(root,'backup');
  for(const dir of [source,staged,out])fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(source,'manifest.json'),JSON.stringify({version:'1.0.0'}));
  fs.writeFileSync(path.join(source,'background.js'),'// actual worker');
  return{root,source,staged,out,backup,cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
}

test('store provenance identifies exact package and image bytes and requires unmodified APIs',()=>{
  const f=fixture();try{
    fs.writeFileSync(path.join(f.staged,'shot.png'),'image bytes');
    const result=captureMetadata({extensionDir:f.source,outputDir:f.staged,details:{mockedChromeApi:false}});
    assert.equal(result.extensionVersion,'1.0.0');
    assert.equal(result.sourceContentsSha256,contentsHash(f.source));
    assert.equal(result.images[0].sha256,sha256(Buffer.from('image bytes')));
    const before=result.sourceContentsSha256;
    fs.appendFileSync(path.join(f.source,'background.js'),'\n// changed');
    assert.notEqual(contentsHash(f.source),before);
    assert.throws(()=>captureMetadata({extensionDir:f.source,outputDir:f.staged,details:{mockedChromeApi:true}}),/unmodified/);
  }finally{f.cleanup()}
});

test('store assets are replaced as a batch and user additions survive',()=>{
  const f=fixture();try{
    fs.writeFileSync(path.join(f.out,'shot.png'),'old screenshot');
    fs.writeFileSync(path.join(f.out,'user-note.txt'),'keep');
    fs.writeFileSync(path.join(f.staged,'shot.png'),'new screenshot');
    fs.writeFileSync(path.join(f.staged,'metadata.json'),'new metadata');
    publishAssets({stagedDir:f.staged,destinationDir:f.out,backupDir:f.backup});
    assert.equal(fs.readFileSync(path.join(f.out,'shot.png'),'utf8'),'new screenshot');
    assert.equal(fs.readFileSync(path.join(f.backup,'shot.png'),'utf8'),'old screenshot');
    assert.equal(fs.readFileSync(path.join(f.out,'user-note.txt'),'utf8'),'keep');
  }finally{f.cleanup()}
});

test('a failure promoting a capture restores prior assets rather than leaving mixed screenshots',()=>{
  const f=fixture();try{
    for(const file of ['a.png','b.png']){
      fs.writeFileSync(path.join(f.out,file),'old '+file);
      fs.writeFileSync(path.join(f.staged,file),'new '+file);
    }
    let calls=0;
    assert.throws(()=>publishAssets({stagedDir:f.staged,destinationDir:f.out,backupDir:f.backup,
      rename:(from,to)=>{if(++calls===2)throw new Error('disk failure');fs.renameSync(from,to);}}),/disk failure/);
    for(const file of ['a.png','b.png'])assert.equal(fs.readFileSync(path.join(f.out,file),'utf8'),'old '+file);
    assert.deepEqual(fs.readdirSync(f.out),['a.png','b.png']);
  }finally{f.cleanup()}
});

test('unavailable capture preserves every existing marketing asset and receives a fresh temporary package',async()=>{
  const store=new URL('../../store/',import.meta.url);
  const before=contentsHash(store.pathname);
  let captured;
  await assert.rejects(generateStoreAssets({captureImpl:async extensionDir=>{
    captured=extensionDir;
    assert.ok(extensionDir.startsWith(os.tmpdir()+path.sep));
    assert.ok(fs.existsSync(path.join(extensionDir,'manifest.json')));
    assert.equal(contentsHash(extensionDir),contentsHash(ROOT,true),'capture package must match current runtime bytes');
    throw new Error('browser unavailable');
  }}),/browser unavailable/);
  assert.equal(contentsHash(store.pathname),before);
  assert.equal(fs.existsSync(captured),false,'private temporary package is cleaned up');
});
