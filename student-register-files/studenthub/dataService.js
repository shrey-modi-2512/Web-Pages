// dataService.js - fetching JSON + localStorage cache (offline-like display)
const CACHE_PREFIX = "studenthub:";

export async function loadJSON(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status + " while loading " + url);
        const data = await res.json();              // parse JSON text -> JS array
        if (!Array.isArray(data)) throw new Error("Expected an array in " + url);
        try { localStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ time: Date.now(), data })); } catch (_) {}
        return { data, fromCache: false };
    } catch (err) {
        const cached = localStorage.getItem(CACHE_PREFIX + url);   // network/file failed -> try cache
        if (cached) {
            const { time, data } = JSON.parse(cached);
            return { data, fromCache: true, time };
        }
        throw err;
    }
}
