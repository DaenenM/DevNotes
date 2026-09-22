import { useCallback, useEffect, useState } from 'react'
import { readFavourites, writeFavourites } from '../api/favourites'

// A Set for O(1) membership checks while rendering; persisted as an array.
export function useFavourites() {
    const [favourites, setFavourites] = useState(() => new Set(readFavourites()))

    useEffect(() => {
        writeFavourites([...favourites])
    }, [favourites])

    const toggleFavourite = useCallback((id) => {
        setFavourites((prev) => {
            const next = new Set(prev)

            if (next.has(id)) next.delete(id)
            else next.add(id)

            return next
        })
    }, [])

    const isFavourite = useCallback((id) => favourites.has(id), [favourites])

    return { favourites, isFavourite, toggleFavourite }
}
