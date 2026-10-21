// main.js - controller: connects data service, list utils and views
import { loadJSON } from "./dataService.js";
import { search, filterBy, sortBy, unique, paginate } from "./listUtils.js";
import { renderList, renderPager, setStatus } from "./views.js";

const CONFIG = {
    events:   { url: "data/events.json",   fields: ["title", "venue", "category"], filter: "category",   sorts: { title: "Title", date: "Date", seats: "Seats" } },
    students: { url: "data/students.json", fields: ["name", "department", "email"], filter: "department", sorts: { name: "Name", cgpa: "CGPA", year: "Year" } },
    faqs:     { url: "data/faqs.json",     fields: ["question", "answer"],          filter: "category",   sorts: { question: "Question", category: "Category" } }
};

const $ = id => document.getElementById(id);
const el = { tabs: $("tabs"), q: $("q"), filter: $("filter"), sort: $("sort"), dir: $("dir"), size: $("size"),
             list: $("list"), pager: $("pager"), status: $("status"), count: $("count") };
const state = { type: "events", data: [], page: 1 };

function update() {
    const cfg = CONFIG[state.type];
    let rows = search(state.data, el.q.value, cfg.fields);
    rows = filterBy(rows, cfg.filter, el.filter.value);
    rows = sortBy(rows, el.sort.value, el.dir.value);
    const info = paginate(rows, state.page, Number(el.size.value));
    state.page = info.page;
    renderList(el.list, info.rows, state.type);
    renderPager(el.pager, info, p => { state.page = p; update(); });
    el.count.textContent = info.total + " record(s) - page " + info.page + " of " + info.pages;
    console.log("[explorer]", state.type, { total: info.total, page: info.page });
}

async function switchTo(type) {
    state.type = type; state.page = 1;
    const cfg = CONFIG[type];
    document.querySelectorAll("#tabs button").forEach(b => b.setAttribute("aria-pressed", b.dataset.type === type));
    el.list.innerHTML = ""; el.pager.innerHTML = ""; el.count.textContent = "";
    setStatus(el.status, "loading", "Loading " + type + "...");           // loading state
    try {
        const { data, fromCache } = await loadJSON(cfg.url);
        state.data = data;
        el.q.value = "";
        el.filter.innerHTML = '<option value="all">All</option>' + unique(data, cfg.filter).map(v => `<option>${v}</option>`).join("");
        el.sort.innerHTML = Object.entries(cfg.sorts).map(([k, l]) => `<option value="${k}">${l}</option>`).join("");
        setStatus(el.status, fromCache ? "info" : "", fromCache ? "Server unreachable - showing cached data." : "");
        update();
    } catch (err) {                                                        // error state
        console.error(err);
        setStatus(el.status, "error", "Could not load data: " + err.message + ". Open this page via http://localhost, not file://.");
    }
}

el.tabs.addEventListener("click", e => { if (e.target.dataset.type) switchTo(e.target.dataset.type); });
[el.filter, el.sort, el.dir, el.size].forEach(c => c.addEventListener("change", () => { state.page = 1; update(); }));
let t; el.q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { state.page = 1; update(); }, 200); });  // debounce

switchTo("events");
