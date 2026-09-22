import { useEffect, useRef, useState } from 'react'

// Tracks which subcategory heading has scrolled up under the sticky banner,
// so the banner can show "Category / Subcategory".
//
// The observer uses a bottom margin of -100% so its window is a thin band at
// the very top of the viewport: a heading "intersects" only while it is at or
// just above that line, which is exactly when it should be named in the banner.
export function useActiveSubcategory() {
    const [active, setActive] = useState({})
    const observerRef = useRef(null)
    const nodesRef = useRef(new Map())

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                setActive((prev) => {
                    const next = { ...prev }

                    for (const entry of entries) {
                        const { category, subcategory } = entry.target.dataset

                        if (entry.boundingClientRect.top <= 0) {
                            // Scrolled past the top edge — this is now current.
                            next[category] = subcategory
                        } else if (next[category] === subcategory) {
                            // Scrolled back down past it; the banner should
                            // drop the suffix until the previous one catches up.
                            delete next[category]
                        }
                    }

                    return next
                })
            },
            { rootMargin: '0px 0px -100% 0px', threshold: 0 }
        )

        observerRef.current = observer

        for (const node of nodesRef.current.values()) {
            if (node) observer.observe(node)
        }

        return () => observer.disconnect()
    }, [])

    // Ref callback for each subcategory heading.
    const registerHeading = (key) => (node) => {
        const existing = nodesRef.current.get(key)

        if (existing && observerRef.current) {
            observerRef.current.unobserve(existing)
        }

        if (node) {
            nodesRef.current.set(key, node)
            observerRef.current?.observe(node)
        } else {
            nodesRef.current.delete(key)
        }
    }

    return { active, registerHeading }
}
