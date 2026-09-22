export function getUniqueCategories(notes) {
    const uniqueNames = [...new Set(notes.map((note) => note.category))]
    return uniqueNames.map((name, index) => ({ 
        id: index, 
        name 
    }))
}


export function getUniqueSubcategories(notes) {
    const uniqueNames = [...new Set(notes.map((note) => note.subcategory))]
    return uniqueNames.map((name, index) => ({ 
        id: index, 
        name 
    }))
}

export function getUniqueLanguages(notes) {
    const uniqueNames = [...new Set(notes.map((note) => note.language))]
    return uniqueNames.map((name, index) => ({ 
        id: index, 
        name 
    }))
}