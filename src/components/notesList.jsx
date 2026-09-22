import { Link } from 'react-router-dom'
import { groupByCategory } from '../utils/groupNotes'
import { useActiveSubcategory } from '../hooks/useActiveSubcategory'
import AttachmentList from './attachmentList'

export default function NotesList({ notes, isFavourite, onToggleFavourite }) {
    const grouped = groupByCategory(notes, isFavourite)
    const { active, registerHeading } = useActiveSubcategory()

    if (grouped.length === 0) {
        return (
            <div className="text-center py-20 opacity-60">
                <p>No notes yet.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-12">
            {grouped.map(({ category, subcategories }) => (
                <section
                    key={category}
                    className="card bg-base-100 border border-base-300 rounded-xl isolate"
                >
                    <header className="sticky top-0 z-[5] bg-neutral text-neutral-content border-b border-base-300 rounded-t-xl px-7 py-4">
                        <h2 className="text-xl font-semibold tracking-tight flex items-baseline gap-2 min-w-0">
                            <span className="shrink-0">{category}</span>
                            {active[category] && (
                                <span className="opacity-60 font-normal text-base truncate">
                                    / {active[category]}
                                </span>
                            )}
                        </h2>
                    </header>

                    <div className="px-7 py-6 flex flex-col gap-9">
                        {subcategories.map(({ subcategory, notes: items }) => (
                            <section key={subcategory}>
                                <h3
                                    ref={registerHeading(`${category}::${subcategory}`)}
                                    data-category={category}
                                    data-subcategory={subcategory}
                                    className="flex items-baseline gap-2.5 mb-4 scroll-mt-16"
                                >
                                    <span className="text-lg font-semibold tracking-tight">
                                        {subcategory}
                                    </span>
                                    <span className="text-xs tabular-nums opacity-40">
                                        {items.length}
                                    </span>
                                </h3>

                                <div className="flex flex-col gap-4">
                                    {items.map((note) => (
                                        <article
                                            key={note.id}
                                            className="rounded-lg border border-base-300 bg-base-100 p-5 transition-colors hover:border-base-content/20 hover:bg-base-200/40"
                                        >
                                            <div className="flex items-start gap-2 mb-2">
                                                <h4 className="font-semibold leading-snug flex-1">
                                                    {note.title}
                                                </h4>

                                                <button
                                                    type="button"
                                                    onClick={() => onToggleFavourite?.(note.id)}
                                                    className="btn btn-ghost btn-xs px-1 shrink-0"
                                                    aria-pressed={isFavourite?.(note.id) ?? false}
                                                    aria-label={
                                                        isFavourite?.(note.id)
                                                            ? `Unfavourite ${note.title}`
                                                            : `Favourite ${note.title}`
                                                    }
                                                    title={isFavourite?.(note.id) ? 'Unfavourite' : 'Favourite'}
                                                >
                                                    <span
                                                        className={
                                                            isFavourite?.(note.id)
                                                                ? 'text-warning text-base leading-none'
                                                                : 'opacity-30 text-base leading-none'
                                                        }
                                                    >
                                                        {isFavourite?.(note.id) ? '★' : '☆'}
                                                    </span>
                                                </button>

                                                <Link
                                                    to={`/notes/${note.id}/edit`}
                                                    className="btn btn-ghost btn-xs shrink-0"
                                                >
                                                    Edit
                                                </Link>
                                            </div>

                                            <p className="text-sm opacity-75 leading-relaxed">
                                                {note.notes}
                                            </p>

                                            {note.codeBlock && (
                                                <div className="relative mt-4 rounded-lg overflow-hidden">
                                                    <span className="absolute top-2 right-3 text-[11px] font-mono uppercase tracking-wider text-neutral-500 select-none pointer-events-none">
                                                        {note.language}
                                                    </span>
                                                    <pre className="bg-neutral-900 text-neutral-100 p-4 pr-20 overflow-x-auto text-sm leading-relaxed">
                                                        <code>{note.codeBlock}</code>
                                                    </pre>
                                                </div>
                                            )}

                                            {note.notesAfter && (
                                                <p className="text-sm opacity-75 leading-relaxed mt-4">
                                                    {note.notesAfter}
                                                </p>
                                            )}

                                            {note.attachments?.length > 0 && (
                                                <AttachmentList attachments={note.attachments} />
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}
