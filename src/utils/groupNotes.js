// Turns a flat note list into category -> subcategory -> notes, so the page
// can print each category and subcategory heading once instead of per row.
//
// isFavourite is optional; when given, favourited notes float to the top of
// their subcategory while keeping their relative order otherwise.
export function groupByCategory(notes, isFavourite) {
    const categories = new Map()

    for (const note of notes) {
        if (!categories.has(note.category)) {
            categories.set(note.category, new Map())
        }

        const subcategories = categories.get(note.category)

        if (!subcategories.has(note.subcategory)) {
            subcategories.set(note.subcategory, [])
        }

        subcategories.get(note.subcategory).push(note)
    }

    const order = (items) => {
        if (!isFavourite) return items

        // A stable partition, so notes keep their incoming order within
        // each group rather than being reshuffled by a comparator.
        const starred = items.filter((note) => isFavourite(note.id))
        const rest = items.filter((note) => !isFavourite(note.id))

        return [...starred, ...rest]
    }

    return [...categories].map(([category, subcategories]) => ({
        category,
        subcategories: [...subcategories].map(([subcategory, items]) => ({
            subcategory,
            notes: order(items),
        })),
    }))
}
