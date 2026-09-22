export const EMPTY_FILTER = {
    category: "",
    subcategory: "",
    search: "",
    language: "",
    favouritesOnly: false,
}

const SEARCHABLE = ['title', 'notes', 'notesAfter', 'codeBlock', 'category', 'subcategory', 'language']

// Levenshtein distance, capped: once every cell in a row exceeds maxDistance
// the strings cannot match, so we bail instead of filling the whole matrix.
function editDistance(a, b, maxDistance) {
    if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1

    let previous = Array.from({ length: b.length + 1 }, (_, i) => i)

    for (let i = 1; i <= a.length; i++) {
        const current = [i]
        let rowMin = i

        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1
            current[j] = Math.min(
                previous[j] + 1,
                current[j - 1] + 1,
                previous[j - 1] + cost,
            )
            rowMin = Math.min(rowMin, current[j])
        }

        if (rowMin > maxDistance) return maxDistance + 1
        previous = current
    }

    return previous[b.length]
}

// Short terms get no slack — at 3 characters an allowance of 1 would match
// far too much. Longer terms tolerate roughly one typo per 5 characters.
function allowedTypos(term) {
    if (term.length < 5) return 0
    if (term.length < 9) return 1
    return 2
}

// A term matches if it appears as a substring, or if it is close enough to
// some word in the text to be a plausible typo.
function matchesTerm(haystackWords, haystack, term) {
    if (haystack.includes(term)) return true

    const tolerance = allowedTypos(term)
    if (tolerance === 0) return false

    return haystackWords.some(
        (word) =>
            Math.abs(word.length - term.length) <= tolerance &&
            editDistance(word, term, tolerance) <= tolerance
    )
}

function searchableText(note) {
    const fields = SEARCHABLE.map((field) => note[field] ?? '')
    const tags = note.tags?.join(' ') ?? ''
    const table = note.table?.rows.flat().join(' ') ?? ''

    return [...fields, tags, table].join(' ').toLowerCase()
}

export function filterNotes(notes, filter, isFavourite) {
    const terms = filter.search.trim().toLowerCase().split(/\s+/).filter(Boolean)

    return notes.filter((note) => {
        if (filter.category && note.category !== filter.category) return false
        if (filter.subcategory && note.subcategory !== filter.subcategory) return false
        if (filter.language && note.language !== filter.language) return false
        if (filter.favouritesOnly && !isFavourite?.(note.id)) return false

        if (terms.length === 0) return true

        const haystack = searchableText(note)
        const words = haystack.split(/[^a-z0-9]+/).filter(Boolean)

        // Any term may match. Requiring all of them means a search like
        // "github branching" finds nothing, because Git branching notes are
        // tagged "git" rather than "github".
        return terms.some((term) => matchesTerm(words, haystack, term))
    })
}

// How many of the search terms a note matches — used to rank results so the
// closest matches surface first.
export function scoreNote(note, filter) {
    const terms = filter.search.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (terms.length === 0) return 0

    const haystack = searchableText(note)
    const words = haystack.split(/[^a-z0-9]+/).filter(Boolean)
    const tags = (note.tags ?? []).map((tag) => tag.toLowerCase())

    let score = 0

    for (const term of terms) {
        // An exact tag hit is the strongest signal we have. A category or
        // subcategory hit means the whole section is relevant, so it ranks
        // just as high.
        const section = `${note.category} ${note.subcategory}`.toLowerCase()

        if (tags.some((tag) => tag === term || tag.includes(term))) score += 3
        else if (section.includes(term)) score += 3
        else if (note.title.toLowerCase().includes(term)) score += 2
        else if (matchesTerm(words, haystack, term)) score += 1
    }

    return score
}

export function hasActiveFilter(filter) {
    return Object.entries(filter).some(([key, value]) =>
        key === 'favouritesOnly' ? value === true : value !== ""
    )
}
