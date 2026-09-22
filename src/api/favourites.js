// Favourites are a small set of note ids, so localStorage is the right home:
// synchronous, survives a refresh, and nothing here is large or binary.

const STORAGE_KEY = 'dev-notes:favourites'

export function readFavourites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const parsed = stored ? JSON.parse(stored) : []
        return Array.isArray(parsed) ? parsed : []
    } catch {
        // Private mode, blocked storage or corrupt JSON: degrade to none.
        return []
    }
}

export function writeFavourites(ids) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
        // Nothing useful to do if storage is unavailable.
    }
}
