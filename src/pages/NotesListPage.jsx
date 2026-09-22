import { useEffect, useMemo, useRef, useState } from "react"
import NotesList from "../components/notesList"
import FilterSearch from "../components/filterSearch"
import { EMPTY_FILTER, filterNotes, hasActiveFilter, scoreNote } from "../utils/filterNotes"
import { useFavourites } from "../hooks/useFavourites"

export default function NotesListPage({ notes }){
    const [filter, setFilter] = useState(EMPTY_FILTER)
    const { isFavourite, toggleFavourite } = useFavourites()

    const visibleNotes = useMemo(() => {
        const matched = filterNotes(notes, filter, isFavourite)

        // With a search term, put the strongest matches first.
        if (!filter.search.trim()) return matched

        return [...matched].sort((a, b) => scoreNote(b, filter) - scoreNote(a, filter))
    }, [notes, filter, isFavourite])

    const isFiltered = hasActiveFilter(filter)

    // Jump back to the top when the results change, so a new search is read
    // from its first result rather than wherever the previous scroll left off.
    // Debounced, otherwise every keystroke would yank the page.
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 300)

        return () => clearTimeout(timer)
    }, [filter])

    return (
        <div>
            <header className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Notes</h1>
                <p className="opacity-60 mt-1">
                    {isFiltered
                        ? `${visibleNotes.length} of ${notes.length} notes`
                        : `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`}
                </p>
            </header>

            <div className="relative">
                <aside className="xl:absolute xl:right-full xl:mr-8 xl:w-[300px] xl:h-full mb-6 sm:mb-8 xl:mb-0">
                    <FilterSearch
                        notes={notes}
                        filter={filter}
                        onChange={setFilter}
                    />
                </aside>

                <div className="min-w-0">
                    {visibleNotes.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="opacity-60 mb-4">No notes match these filters.</p>
                            <button
                                type="button"
                                onClick={() => setFilter(EMPTY_FILTER)}
                                className="btn btn-sm"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <NotesList
                            notes={visibleNotes}
                            isFavourite={isFavourite}
                            onToggleFavourite={toggleFavourite}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
