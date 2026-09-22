// PDF attachments live in IndexedDB rather than in notesData.js: a File is
// binary, and the notes module is plain JS held in memory. IndexedDB stores
// the actual bytes and survives a refresh, which localStorage could not do
// (it is string-only and capped at a few megabytes).

const DB_NAME = 'dev-notes'
const DB_VERSION = 1
const STORE = 'attachments'

let dbPromise = null

function openDb() {
    if (dbPromise) return dbPromise

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = () => {
            const db = request.result

            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: 'id' })
                // Every lookup is "all attachments for this note".
                store.createIndex('noteId', 'noteId', { unique: false })
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })

    return dbPromise
}

function runTransaction(mode, work) {
    return openDb().then(
        (db) =>
            new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE, mode)
                const store = transaction.objectStore(STORE)

                let result
                work(store, (value) => { result = value })

                transaction.oncomplete = () => resolve(result)
                transaction.onerror = () => reject(transaction.error)
                transaction.onabort = () => reject(transaction.error)
            })
    )
}

export async function saveAttachments(noteId, files) {
    if (!files?.length) return []

    const records = files.map((file) => ({
        id: `${noteId}-${file.name}-${crypto.randomUUID()}`,
        noteId,
        name: file.name,
        size: file.size,
        type: file.type,
        addedAt: Date.now(),
        // Blobs are stored natively by IndexedDB — no base64 encoding needed,
        // which keeps large PDFs from tripling in size.
        blob: file,
    }))

    await runTransaction('readwrite', (store) => {
        for (const record of records) store.put(record)
    })

    // Strip the blob: callers only need metadata, not the bytes.
    return records.map((record) => ({
        id: record.id,
        noteId: record.noteId,
        name: record.name,
        size: record.size,
        type: record.type,
        addedAt: record.addedAt,
    }))
}

export async function getAttachments(noteId) {
    return runTransaction('readonly', (store, setResult) => {
        const request = store.index('noteId').getAll(noteId)
        request.onsuccess = () => setResult(request.result ?? [])
    })
}

export async function deleteAttachment(id) {
    await runTransaction('readwrite', (store) => {
        store.delete(id)
    })
}

// Object URLs hold memory until revoked, so callers must release them when
// the component unmounts or the file is replaced.
export function createAttachmentUrl(blob) {
    return URL.createObjectURL(blob)
}

export function revokeAttachmentUrl(url) {
    URL.revokeObjectURL(url)
}
