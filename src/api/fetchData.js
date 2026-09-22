import { NOTES } from '../notesData'
import { saveAttachments } from './attachments'

// Local, in-memory data source. Swap these functions for real fetch() calls
// when a backend exists — the hooks and components stay as they are.
//
// All are async so the call sites already handle promises, loading states
// and errors the way they would against a network.

let notes = [...NOTES]

export async function fetchNotes(){
    return [...notes]
}

export async function createNote(data){
    const { files = [], ...fields } = data

    const nextId = notes.reduce((max, note) => Math.max(max, note.id), 0) + 1

    // PDFs go to IndexedDB; the note keeps only their metadata.
    const attachments = await saveAttachments(nextId, files)

    const note = { ...fields, id: nextId, attachments }

    notes = [...notes, note]

    return note
}

export async function updateNote({ id, files = [], ...fields }){
    const existing = notes.find((note) => note.id === id)

    if (!existing) {
        throw new Error(`No note with id ${id}`)
    }

    // Newly picked files are appended to whatever the note already had.
    const added = await saveAttachments(id, files)

    const updated = {
        ...existing,
        ...fields,
        id,
        attachments: [...(existing.attachments ?? []), ...added],
    }

    notes = notes.map((note) => (note.id === id ? updated : note))

    return updated
}

export async function deleteNote(id){
    notes = notes.filter((note) => note.id !== id)
    return id
}
