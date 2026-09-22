import { useEffect, useState } from 'react'
import { getAttachments, createAttachmentUrl, revokeAttachmentUrl } from '../api/attachments'

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AttachmentList({ attachments }) {
    const [urls, setUrls] = useState({})

    const noteId = attachments[0]?.noteId

    useEffect(() => {
        if (noteId === undefined) return

        let cancelled = false
        const created = []

        getAttachments(noteId).then((records) => {
            if (cancelled) return

            const next = {}
            for (const record of records) {
                const url = createAttachmentUrl(record.blob)
                next[record.id] = url
                created.push(url)
            }
            setUrls(next)
        })

        // Object URLs pin the blob in memory until revoked.
        return () => {
            cancelled = true
            created.forEach(revokeAttachmentUrl)
        }
    }, [noteId])

    return (
        <ul className="mt-4 flex flex-col gap-2">
            {attachments.map((attachment) => {
                const url = urls[attachment.id]

                return (
                    <li key={attachment.id}>
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-3 rounded-lg border border-base-300 bg-base-200/40 px-3 py-2 transition-colors ${
                                url ? 'hover:border-base-content/25 hover:bg-base-200' : 'pointer-events-none opacity-60'
                            }`}
                        >
                            <span className="badge badge-sm shrink-0">PDF</span>
                            <span className="flex-1 truncate text-sm font-medium">
                                {attachment.name}
                            </span>
                            <span className="text-xs opacity-60 tabular-nums shrink-0">
                                {formatSize(attachment.size)}
                            </span>
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}
