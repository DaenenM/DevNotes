import { useMemo } from 'react'
import { EMPTY_FILTER, hasActiveFilter } from '../utils/filterNotes'

function unique(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b))
}

export default function FilterSearch({ notes, filter, onChange }) {
    const categories = useMemo(
        () => unique(notes.map((note) => note.category)),
        [notes]
    )

    // Only offer subcategories that exist inside the chosen category, so the
    // two dropdowns can never combine into an empty result.
    const subcategories = useMemo(() => {
        const scoped = filter.category
            ? notes.filter((note) => note.category === filter.category)
            : notes
        return unique(scoped.map((note) => note.subcategory))
    }, [notes, filter.category])

    const languages = useMemo(
        () => unique(notes.map((note) => note.language)),
        [notes]
    )

    function handleChange(e) {
        const { name, value, type, checked } = e.target

        if (type === 'checkbox') {
            onChange({ ...filter, [name]: checked })
            return
        }

        // Changing category invalidates any subcategory chosen under the old one.
        if (name === 'category') {
            onChange({ ...filter, category: value, subcategory: "" })
            return
        }

        onChange({ ...filter, [name]: value })
    }

    return (
        <div className="card bg-base-100 border border-base-300 rounded-xl xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="card-body p-4 sm:p-5 gap-3 sm:gap-4">
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-1">
                    <label className="form-control w-full sm:col-span-2 xl:col-span-1">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Search</span>
                        </div>
                        <input
                            type="search"
                            name="search"
                            value={filter.search}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Search titles, notes, code…"
                        />
                    </label>

                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Category</span>
                        </div>
                        <select
                            name="category"
                            value={filter.category}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">All categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Subcategory</span>
                        </div>
                        <select
                            name="subcategory"
                            value={filter.subcategory}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">All subcategories</option>
                            {subcategories.map((subcategory) => (
                                <option key={subcategory} value={subcategory}>
                                    {subcategory}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Language</span>
                        </div>
                        <select
                            name="language"
                            value={filter.language}
                            onChange={handleChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">All languages</option>
                            {languages.map((language) => (
                                <option key={language} value={language}>
                                    {language}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <label className="label cursor-pointer justify-start gap-3 px-0">
                    <input
                        type="checkbox"
                        name="favouritesOnly"
                        checked={filter.favouritesOnly}
                        onChange={handleChange}
                        className="checkbox checkbox-sm"
                    />
                    <span className="label-text font-medium">Favourites only</span>
                </label>

                {hasActiveFilter(filter) && (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => onChange(EMPTY_FILTER)}
                            className="btn btn-ghost btn-sm"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
