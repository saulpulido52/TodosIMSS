const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../dist/app.js'),'utf8');
const guard=source.slice(source.indexOf('const BALLOT_KEY'),source.indexOf('const MIN='));
const submission=source.slice(source.indexOf('async function submitVote()'),source.indexOf('function applyParticipationLock()'));
function fixture(storage){
 const el={};const $=id=>el[id]??= {value:'',className:'',textContent:'',disabled:false,classList:{remove(){}},setAttribute(){}};
 let locks=Promise.resolve();
 const c=vm.createContext({localStorage:storage,$,document:{querySelectorAll:()=>[]},navigator:{locks:{request:(_key,fn)=>{const job=locks.then(fn);locks=job.catch(()=>{});return job;}}}});
 vm.runInContext(guard+"let finished=false,choice='yes';const tokens=new Map([['CODE',{scope:'UNIT',used:false}]]);function voteScope(){return 'UNIT';}function applyParticipationLock(){finished=true;}"+submission,c);
 $('codeInput').value='CODE';return {c,$};
}
function memory(){const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};}
test('participation survives a new page context, without storing an answer',async()=>{const store=memory(),first=fixture(store);await vm.runInContext('submitVote()',first.c);assert.equal(vm.runInContext('participationState()',first.c),'voted');assert.equal(vm.runInContext('choice',first.c),null);const second=fixture(store);assert.equal(vm.runInContext('participationState()',second.c),'voted');await vm.runInContext('submitVote()',second.c);assert.equal(vm.runInContext("tokens.get('CODE').used",second.c),false);});
test('invalid codes do not mark participation',async()=>{const f=fixture(memory());f.$('codeInput').value='INVALID';await vm.runInContext('submitVote()',f.c);assert.equal(vm.runInContext('participationState()',f.c),'ready');assert.match(f.$('voteStatus').textContent,/inválido/);});
test('storage failure fails closed',async()=>{const f=fixture({getItem:()=>null,setItem:()=>{throw Error('Blocked');}});await vm.runInContext('submitVote()',f.c);assert.equal(vm.runInContext("tokens.get('CODE').used",f.c),false);assert.match(f.$('voteStatus').textContent,/No se aceptó/);});
test('concurrent confirmation does not consume twice',async()=>{const f=fixture(memory());await Promise.all([vm.runInContext('submitVote()',f.c),vm.runInContext('submitVote()',f.c)]);assert.equal(vm.runInContext('finished',f.c),true);assert.equal(vm.runInContext('participationState()',f.c),'voted');});
