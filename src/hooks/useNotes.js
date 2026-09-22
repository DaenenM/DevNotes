import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchNotes, createNote, updateNote, deleteNote } from '../api/fetchData'

export function useNotes(){
    const { data: notes = [], isLoading, isError, error } = useQuery({
        queryKey: ['notes'],
        queryFn: fetchNotes
    })

    return { notes, isLoading, isError, error }
}

// Every mutation invalidates the same list, so they share one setup.
function useNoteMutation(mutationFn) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] })
        },
    })
}

export function useCreateNote() {
    return useNoteMutation(createNote)
}

export function useUpdateNote() {
    return useNoteMutation(updateNote)
}

export function useDeleteNote() {
    return useNoteMutation(deleteNote)
}
