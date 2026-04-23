'use client'

import { FieldValue } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { PostSchema, PostSearchSchemaType } from "@/app/utils/zod";

export type PostType = 'search' | 'sell'
export type PostStatus = 'active' | 'closed' | 'deleted'


type SearchPostContextType = {
  searchPost: PostSearchSchemaType | null;
  setSearchPost: (post: PostSearchSchemaType | null) => void;
  clearSearchPost: () => void;
  postLoading: boolean;
  setPostLoading: (postLoading: boolean) => void;
};

const SearchPostContext = createContext<SearchPostContextType | null>(null);

export function SearchPostProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchPost, setSearchPost] = useState<PostSearchSchemaType | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  function clearSearchPost() {
    setSearchPost(null);
  }

  return (
    <SearchPostContext.Provider
      value={{
        searchPost,
        setSearchPost,
        clearSearchPost,
        postLoading,
        setPostLoading
      }}
    >
      {children}
    </SearchPostContext.Provider>
  );
}

export function useSearchPost() {
  const context = useContext(SearchPostContext);

  if (!context) {
    throw new Error("useSearchPost must be used within SearchPostProvider");
  }

  return context;
}

