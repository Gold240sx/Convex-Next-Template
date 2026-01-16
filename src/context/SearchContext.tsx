"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
  placeholder: string
  setPlaceholder: (placeholder: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("")
  const [placeholder, setPlaceholder] = useState("Search...")

  return (
    <SearchContext.Provider value={{ query, setQuery, placeholder, setPlaceholder }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
