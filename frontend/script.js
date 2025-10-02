const pages = [...document.querySelectorAll('.page')];
document.querySelectorAll('[data-go]').forEach(el=>{
  el.addEventListener('click', ()=>{
    const id = el.getAttribute('data-go');
    pages.forEach(p=>p.classList.toggle('active', p.id===id));
    window.scrollTo({top:0, behavior:'smooth'});
  });
});

// simple mock store in localStorage
const STORE_KEY = 'cvp_demo_store';
const initData = {
  certificates:[
    {id:'CERT-2025-71364', holder:'malak shaheen', program:'IT', issueDate:'2004-01-26', status:'Valid', hash:'0x825c6c9e...7d'},
    {id:'CERT-2025-02060', holder:'maleeka', program:'ssff', issueDate:'2001-06-04', status:'Valid', hash:'0x60dad9f4...60'},
    {id:'CERT-2025-55552', holder:'mmalkrrj', program:'fgdfht', issueDate:'2001-06-04', status:'Valid', hash:'0x7590f7d8...75'}
  ]
};
function loadStore(){
  try { return JSON.parse(localStorage.getItem(STORE_KEY))||initData; } catch(e){ return initData; }
}
function saveStore(data){ localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
function reset(){ localStorage.removeItem(STORE_KEY); location.reload(); }
document.querySelector('[data-reset]')?.addEventListener('click', reset);

const store = loadStore();
renderTable();

function renderTable(){
  const tbl = document.getElementById('tbl');
  if(!tbl) return;
  tbl.innerHTML = `<tr>
    <th>ID</th><th>Holder</th><th>Program</th><th>Issue Date</th><th>Status</th><th>Hash</th>
  </tr>` + store.certificates.map(c=>(`
    <tr><td>${c.id}</td><td>${c.holder}</td><td>${c.program}</td><td>${c.issueDate}</td><td><span class="pill pill-valid">Valid</span></td><td>${c.hash}</td></tr>
  `)).join('');
}

// verify
document.getElementById('quickVerify')?.addEventListener('click', ()=>{
  const id = document.getElementById('quickId').value.trim();
  goVerify(id);
});
document.getElementById('btnVerify')?.addEventListener('click', ()=>{
  const id = document.getElementById('verifyId').value.trim();
  goVerify(id);
});
function goVerify(id){
  const res = document.getElementById('verifyResult');
  const found = store.certificates.find(c=>c.id===id);
  if(found) {
    res.className = 'pill pill-valid';
    res.textContent = `Valid — ${found.id} — ${found.holder} — ${found.hash}`;
  } else {
    res.className = 'pill pill-bad';
    res.textContent = 'Not Found';
  }
}

// issue form (mock)
document.getElementById('genHash')?.addEventListener('click', ()=>{
  const holder = document.getElementById('holder').value || 'unknown';
  const program = document.getElementById('program').value || '-';
  const meta = `${holder} — ${program} — ${new Date().toISOString().slice(0,10)}`;
  document.getElementById('preview').textContent = meta + '\\n(hash shown after Submit)';
});
document.getElementById('submit')?.addEventListener('click', ()=>{
  const id = 'CERT-2025-' + Math.floor(10000+Math.random()*89999);
  const hash = '0x' + Math.random().toString(16).slice(2,10).padEnd(8,'0') + '...' + Math.random().toString(16).slice(2,4);
  store.certificates.unshift({id, holder: document.getElementById('holder').value || '—',
     program: document.getElementById('program').value || '—', issueDate: (document.getElementById('issueDate').value || '2025-10-01'), status:'Valid', hash});
  saveStore(store);
  renderTable();
  document.getElementById('preview').textContent = `Submitted ${id}\\nHash ${hash}`;
  alert('Mock issue saved locally. For real on-chain issue use the Remix contract.');
});
