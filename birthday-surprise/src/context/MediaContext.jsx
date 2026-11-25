import { createContext, useContext } from 'react'
import { useMediaStore } from '../hooks/useMediaStore'

const MediaContext = createContext(null)

export function MediaProvider({ children }) {
  const store = useMediaStore()
  return (
    <MediaContext.Provider value={store}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error('useMedia must be used inside MediaProvider')
  return ctx
}
