'use client';
import { TransactionData, } from "@/interface/search-data";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface SearchDataContextType {
  sharedSearchData: TransactionData | null;
  setSearchSharedData: React.Dispatch<React.SetStateAction<TransactionData | null>>;
}

const SearchDataContext = createContext<SearchDataContextType | undefined>(undefined);

export const SearchDataProvider = ({ children }: { children: ReactNode }) => {
  const [sharedSearchData, setSearchSharedData] = useState<TransactionData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("SearchData");
      if (storedData) {
        setSearchSharedData(JSON.parse(storedData));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && sharedSearchData) {
      localStorage.setItem("SearchData", JSON.stringify(sharedSearchData));
    }
  }, [sharedSearchData]);

  return (
    <SearchDataContext.Provider value={{ sharedSearchData, setSearchSharedData }}>
      {children}
    </SearchDataContext.Provider>
  );
};

export const useSearchData = (): SearchDataContextType => {
  const context = useContext(SearchDataContext);

  if (!context) {
    throw new Error("useSearchData must be used within a SearchDataProvider");
  }

  return context;
};
