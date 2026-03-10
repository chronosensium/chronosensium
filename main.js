/* ── LOADER ── */
(function initLoader() {
  const lbar = document.getElementById('lbar');
  const lpct = document.getElementById('lpct');
  const loader = document.getElementById('loader');
  if (!loader) return;

  function hide() {
    if (lbar) lbar.style.width = '100%';
    if (lpct) lpct.textContent = '100%';
    setTimeout(() => loader.classList.add('out'), 350);
  }

  let prog = 0;
  const iv = setInterval(() => {
    prog = Math.min(prog + Math.random() * 14 + 3, 90);
    if (lbar) lbar.style.width = prog + '%';
    if (lpct) lpct.textContent = Math.round(prog)
