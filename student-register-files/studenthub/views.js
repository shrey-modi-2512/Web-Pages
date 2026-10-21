// views.js - rendering only (DOM), no data logic
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const cards = {
    events: e => `<article class="card"><span class="tag">${esc(e.category)}</span><h3>${esc(e.title)}</h3>
        <p>📅 ${esc(e.date)} &nbsp; 📍 ${esc(e.venue)}</p><p>Seats: ${esc(e.seats)}</p></article>`,
    students: s => `<article class="card"><span class="tag">Year ${esc(s.year)}</span><h3>${esc(s.name)}</h3>
        <p>${esc(s.department)}</p><p>CGPA: ${esc(s.cgpa)}</p><p>${esc(s.email)}</p></article>`,
    faqs: f => `<article class="card"><span class="tag">${esc(f.category)}</span><h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p></article>`
};

export function renderList(el, rows, type) {
    el.innerHTML = rows.length ? rows.map(cards[type]).join("") : '<p class="empty">No results match your search or filter.</p>';
}

export function renderPager(el, info, onGo) {
    const btn = (label, p, dis, cur) => `<button data-p="${p}" ${dis ? "disabled" : ""} ${cur ? 'aria-current="page" class="cur"' : ""}>${label}</button>`;
    let html = btn("Prev", info.page - 1, info.page === 1);
    for (let i = 1; i <= info.pages; i++) html += btn(i, i, false, i === info.page);
    html += btn("Next", info.page + 1, info.page === info.pages);
    el.innerHTML = html;
    el.querySelectorAll("button").forEach(b => b.addEventListener("click", () => onGo(Number(b.dataset.p))));
}

export function setStatus(el, kind, msg) {   // kind: loading | error | info | ""
    el.className = "status " + kind;
    el.textContent = msg;
    el.hidden = msg === "";
}
