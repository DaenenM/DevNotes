import { useState } from 'react'
import { getUniqueCategories, getUniqueLanguages, getUniqueSubcategories } from '../utils/uniqueNames'

const EMPTY_FORM = {
    category: "",
    subcategory: "",
    title: "",
    tags: "",
    notes: "",
    codeBlock: "",
    notesAfter: "",
    language: "",
}


// initialNote turns this into an edit form; tags arrive as an array and are
// shown as a comma-separated string.
function toFormState(note) {
    if (!note) return EMPTY_FORM

    return {
        category: note.category ?? "",
        subcategory: note.subcategory ?? "",
        title: note.title ?? "",
        tags: (note.tags ?? []).join(', '),
        notes: note.notes ?? "",
        codeBlock: note.codeBlock ?? "",
        notesAfter: note.notesAfter ?? "",
        language: note.language ?? "",
    }
}

export default function NoteForm({ notes, onSubmit, initialNote, submitLabel, onCancel }) {
    const [form, setForm] = useState(() => toFormState(initialNote))
    const [files, setFiles] = useState([])

    const CATEGORY_OPTIONS = getUniqueCategories(notes)
    const SUBCATEGORY_OPTIONS = getUniqueSubcategories(notes)
    const LANGUAGE_OPTIONS = getUniqueLanguages(notes)

    function handleChange(e){
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleFiles(e) {
        const picked = [...e.target.files].filter(
            (file) => file.type === 'application/pdf'
        )

        // Appending rather than replacing lets the user add files in batches.
        setFiles((prev) => [...prev, ...picked])

        // Reset the input so picking the same file twice still fires onChange.
        e.target.value = ''
    }

    function removeFile(index) {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }
    function handleSubmit(e) {
        e.preventDefault()

        onSubmit({
            ...form,
            tags: form.tags
                .split(',')
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean),
            files,
        })

        if (!initialNote) {
            setForm(EMPTY_FORM)
        }

        setFiles([])
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Category</span>
                        </div>
                        <input
                            type="text"
                            name="category"
                            list="category-options"
                            value={form.category}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="e.g. React Tan"
                            required
                        />
                        <datalist id="category-options">
                            {CATEGORY_OPTIONS.map((cat) => (
                                <option key={cat.id} value={cat.name} />
                            ))}
                        </datalist>
                        
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Subcategory</span>
                        </div>
                        <input
                            type="text"
                            name="subcategory"
                            list="subcategory-options"
                            value={form.subcategory}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Tanstack Query"
                            required
                        />
                        <datalist id="subcategory-options">
                            {SUBCATEGORY_OPTIONS.map((subcat) => (
                                <option key={subcat.id} value={subcat.name} />
                            ))}
                        </datalist>
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Title</span>
                        </div>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="queryFn takes a reference"
                            required
                        />
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Notes</span>
                        </div>
                        <textarea
                            name="notes"
                            rows={3}
                            value={form.notes}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full leading-relaxed"
                            placeholder="Response.json() rejects if the body is not valid JSON."
                            required
                        />
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Code Block</span>
                            <span className="label-text-alt opacity-60">optional</span>
                        </div>
                        <textarea
                            name="codeBlock"
                            rows={5}
                            value={form.codeBlock}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full font-mono text-sm leading-relaxed"
                            placeholder="useQuery({ queryKey: ['notes'], queryFn: fetchNotes, });"
                        />
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Follow-up Notes</span>
                            <span className="label-text-alt opacity-60">optional</span>
                        </div>
                        <textarea
                            name="notesAfter"
                            rows={3}
                            value={form.notesAfter}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full leading-relaxed"
                            placeholder="Anything worth adding after the code — caveats, alternatives, when not to use it."
                        />
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Language</span>
                        </div>
                        <input
                            type="text"
                            name="language"
                            list="language-options"
                            value={form.language}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Tanstack Query"
                            required
                        />
                        <datalist id="language-options">
                            {LANGUAGE_OPTIONS.map((language) => (
                                <option key={language.id} value={language.name} />
                            ))}
                        </datalist>
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Search Tags</span>
                            <span className="label-text-alt opacity-60">comma separated</span>
                        </div>
                        <input
                            type="text"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="git, branching, merge"
                        />
                    </label>
                </div>

                <div>
                    <label className="form-control w-full">
                        <div className="label pb-1">
                            <span className="label-text font-medium">Guides</span>
                            <span className="label-text-alt opacity-60">PDF, optional</span>
                        </div>
                        <input
                            type="file"
                            accept="application/pdf"
                            multiple
                            onChange={handleFiles}
                            className="file-input file-input-bordered w-full"
                        />
                    </label>

                    {files.length > 0 && (
                        <ul className="mt-3 flex flex-col gap-2">
                            {files.map((file, index) => (
                                <li
                                    key={`${file.name}-${index}`}
                                    className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-200/40 px-3 py-2"
                                >
                                    <span className="flex-1 truncate text-sm">{file.name}</span>
                                    <span className="text-xs opacity-60 tabular-nums shrink-0">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="btn btn-ghost btn-xs"
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="card-actions justify-end pt-4 border-t border-base-300 mt-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary px-8">
                        {submitLabel ?? 'Create Note'}
                    </button>
                </div>

            </form>
        </div>
    )
}
