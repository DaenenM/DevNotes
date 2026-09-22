import NoteForm from "../components/noteForm"
import { useCreateNote } from "../hooks/useNotes"
import { useNavigate } from 'react-router-dom'


export default function CreateNotePage({ notes }){
    const navigate = useNavigate()

    const { mutate: createNote, isPending } = useCreateNote()

    function handleSubmit(formData) {
        // In-memory for now; useCreateNote swaps to a real POST when a backend exists.
        createNote(formData, {
            onSuccess: () => navigate('/')
        })
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight">New Note</h1>
                <p className="opacity-60 mt-1">Add a snippet to your collection.</p>
            </header>

            <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                    {isPending && (
                        <div className="flex items-center gap-2 text-sm opacity-70">
                            <span className="loading loading-spinner loading-sm" />
                            Saving…
                        </div>
                    )}

                    <NoteForm
                        notes={notes}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}
