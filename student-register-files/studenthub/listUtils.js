// listUtils.js - pure array helpers (no DOM): search, filter, sort, paginate
export const search = (items, term, fields) => {
    const t = term.trim().toLowerCase();
    return t === "" ? items : items.filter(it => fields.some(f => String(it[f]).toLowerCase().includes(t)));
};

export const filterBy = (items, field, value) =>
    value === "all" ? items : items.filter(it => String(it[field]) === value);

export const sortBy = (items, key, dir = "asc") => {
    const sign = dir === "asc" ? 1 : -1;
    return [...items].sort((a, b) =>
        (typeof a[key] === "number" ? a[key] - b[key] : String(a[key]).localeCompare(String(b[key]))) * sign);
};

export const unique = (items, field) => [...new Set(items.map(it => it[field]))].sort();

export const paginate = (items, page, size) => {
    const pages = Math.max(1, Math.ceil(items.length / size));
    const current = Math.min(Math.max(1, page), pages);
    return { rows: items.slice((current - 1) * size, current * size), page: current, pages, total: items.length };
};
