import { createWithEqualityFn } from "zustand/traditional"



type State = {
    pageNumber: number
    pageSize: number
    pageCount: number
    searchTerm: string
    searchValue: string
    orderBy: string
    filterBy: string
}

type Actions = {
    setParams: (params: Partial<State>) => void
    setSearchValue: (value: string) => void
    reset: () => void
}

const initialState: State = {
    pageNumber: 1,
    pageSize: 12,
    pageCount: 1,
    searchTerm: '',
    searchValue: '',
    orderBy: 'make',
    filterBy: 'live'
}

// The param store has two actions setParams and Reset
// If newParams contains a page number, it will only update the page Number
// If new Params does not contain a page number, it gets the current state (spread) and then
// updates all of it with the spread of newParams (i.e new pageSize) and make page number go back to 1.
export const useParamsStore = createWithEqualityFn<State & Actions>()((set) => ({
    ...initialState, 
    setParams: (newParams: Partial<State>) => {
        set((state) => {
            if (newParams.pageNumber) {
                return {...state, pageNumber: newParams.pageNumber}
            } else {
                return {...state, ...newParams, pageNumber: 1}
            }
        })
    },
    setSearchValue: (value: string) => {
        set({searchValue: value})
    },
    reset: () => set(initialState)
}))