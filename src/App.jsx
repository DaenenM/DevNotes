import { useNotes } from './hooks/useNotes'
import NotesListPage from './pages/NotesListPage'
import CreateNotePage from './pages/CreateNotePage'
import EditNotePage from './pages/EditNotePage'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'

function App() {
  const { notes, isLoading, isError, error } = useNotes()

  return (
    <BrowserRouter>
      <div className='bg-base-200 min-h-screen'>
        {/* A small floating menu rather than a full-width bar, so the list
            gets the whole width of the page. */}
        <div className="sticky top-0 z-20 px-6 pt-4">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm bg-base-100 border border-base-300 shadow-sm gap-2 font-semibold"
            >
              Dev Notes
              <span aria-hidden="true" className="text-[10px] opacity-60">▼</span>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu mt-2 w-52 rounded-lg bg-base-100 border border-base-300 shadow-lg p-2 z-30"
            >
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => (isActive ? 'active font-medium' : '')}
                >
                  All notes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/new"
                  end
                  className={({ isActive }) => (isActive ? 'active font-medium' : '')}
                >
                  New note
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <main className="px-6 pt-6 pb-12 max-w-4xl mx-auto">
          {isLoading && (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg" />
            </div>
          )}
          {isError && (
            <div role="alert" className="alert alert-error">
              <span>{error.message}</span>
            </div>
          )}

          {!isLoading && !isError && (
            <Routes>
              <Route path="/" element={<NotesListPage notes={notes}/>} />
              <Route path="/new" element={<CreateNotePage notes={notes}/>} />
              <Route path="/notes/:id/edit" element={<EditNotePage notes={notes}/>} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
