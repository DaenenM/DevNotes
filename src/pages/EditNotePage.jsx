import { useNavigate, useParams } from 'react-router-dom'
import NoteForm from "../components/noteForm"
import { useDeleteNote, useUpdateNote } from "../hooks/useNotes"

export default function EditNotePage({ notes }){
    const navigate = useNavigate()
    const { id } = useParams()

    // Route params are strings; note ids are numbers.
    const note = notes.find((item) => String(item.id) === id)

    const { mutate: updateNote, isPending } = useUpdateNote()
    const { mutate: deleteNote } = useDeleteNote()

    if (!note) {
        return (
            <div className="text-center py-20">
                <p className="opacity-60 mb-4">That note no longer exists.</p>
                <button type="button" onClick={() => navigate('/')} className="btn btn-sm">
                    Back to notes
                </button>
            </div>
        )
    }

    function handleSubmit(formData) {
        updateNote(
            { ...formData, id: note.id },
            { onSuccess: () => navigate('/') }
        )
    }

    function handleDelete() {
        if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return

        deleteNote(note.id, { onSuccess: () => navigate('/') })
    }

    return (
        <div>
            <header className="mb-6 sm:mb-8 flex items-start justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Edit Note</h1>
                    <p className="opacity-60 mt-1">{note.title}</p>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-ghost btn-sm text-error shrink-0"
                >
                    Delete
                </button>
            </header>

            <div className="card bg-base-100 border border-base-300">
                <div className="card-body p-4 sm:p-6">
                    {isPending && (
                        <div className="flex items-center gap-2 text-sm opacity-70">
                            <span className="loading loading-spinner loading-sm" />
                            Saving…
                        </div>
                    )}

                    <NoteForm
                        notes={notes}
                        initialNote={note}
                        submitLabel="Save Changes"
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/')}
                    />
                </div>
            </div>
        </div>
    )
}
