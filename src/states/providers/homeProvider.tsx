import { createContext, useReducer, useEffect, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};
/**
 *
 */
type TAction =
  | {
    type: "SET_QUERY";
    payload: Partial<{ term: string | null; sortBy: string; searching: boolean }>;
  }
  | {
    type: "SET_VIEWMODE";
    payload: "grid" | "list";
  }
  | {
    type: "SET_SHOW_FILTER";
    payload: boolean;
  }
  | {
    type: "SET_SEARCHTERM";
    payload: string | null;
  }
  | {
    type: "SET_SEARCHING";
    payload: boolean;
  }
  | {
    type: "SET_SORTBY";
    payload: string;
  };

/**
 *
 */
interface IHomeStates {
  showFilter: boolean;
  viewMode: "grid" | "list";
  searchQuery: { term: string | null; sortBy: string; searching: boolean };
  changeQuery: (query: Partial<IHomeStates["searchQuery"]>) => void;
  changeSearchTerm: (term: string | null) => void;
  changeSearching: (isSearching: boolean) => void;
  changeShowFilter: (isOpen: boolean) => void;
  toggleShowFilter: () => void;
  changeSearchSortBy: (sortBy: string) => void;
  changeViewMode: (view: "grid" | "list") => void;
}
const InitialStates: IHomeStates = {
  viewMode: "grid",
  showFilter: true,
  searchQuery: { term: null, sortBy: "relevance", searching: false },
  changeQuery: () => void 0,
  changeViewMode: () => void 0,
  changeSearching: () => void 0,
  changeShowFilter: () => void 0,
  changeSearchTerm: () => void 0,
  toggleShowFilter: () => void 0,
  changeSearchSortBy: () => void 0,
};
/**
 *
 */
export const HomeContext = createContext<IHomeStates>(InitialStates);
/**
 *
 * @param states IHomeStates
 * @param action TAction
 * @returns IHomeStates
 */
function reducer(states: IHomeStates, action: TAction): IHomeStates {
  switch (action.type) {
    case "SET_VIEWMODE":
      return { ...states, viewMode: action.payload };
    case "SET_SHOW_FILTER":
      return { ...states, showFilter: action.payload };
    case "SET_SEARCHTERM": {
      return {
        ...states,
        searchQuery: Object.assign(states.searchQuery, {
          term: action.payload,
        }),
      };
    }
    case "SET_SEARCHING": {
      return {
        ...states,
        searchQuery: Object.assign(states.searchQuery, {
          searching: action.payload,
        }),
      };
    }
    case "SET_SORTBY": {
      return {
        ...states,
        searchQuery: Object.assign(states.searchQuery, {
          sortBy: action.payload,
        }),
      };
    }
    case "SET_QUERY": {
      return {
        ...states,
        searchQuery: Object.assign(states.searchQuery, action.payload),
      };
    }
    default:
      return states;
  }
}

export function HomeProvider({ children }: Props) {
  const [{ viewMode, showFilter, searchQuery }, dispatch] = useReducer(
    reducer,
    InitialStates,
  );
  // Automatically hide filters on mobile/tablet on initial load
  useEffect(() => {
    const checkScreenSize = () => {
      // Hide filters on screens smaller than 1024px (tablet and mobile)
      const shouldHideFilters = window.innerWidth < 1024;
      dispatch({ type: "SET_SHOW_FILTER", payload: !shouldHideFilters });
    };
    // Check on mount
    checkScreenSize();
    // Add resize listener to handle orientation changes
    window.addEventListener("resize", checkScreenSize);
    //
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  //
  const changeShowFilter = (show: boolean) =>
    dispatch({ type: "SET_SHOW_FILTER", payload: show });
  const toggleShowFilter = () =>
    dispatch({ type: "SET_SHOW_FILTER", payload: !showFilter });
  //
  const changeSearchTerm = (term: string | null) =>
    dispatch({ type: "SET_SEARCHTERM", payload: term });
  //
  const changeSearchSortBy = (sortBy: string) =>
    dispatch({ type: "SET_SORTBY", payload: sortBy });
  //
  const changeSearching = (isSearching: boolean) =>
    dispatch({ type: "SET_SEARCHING", payload: isSearching });
  //
  const changeQuery = (query: Partial<IHomeStates["searchQuery"]>) =>
    dispatch({ type: "SET_QUERY", payload: query });
  //
  const changeViewMode = (view: "grid" | "list") =>
    dispatch({ type: "SET_VIEWMODE", payload: view });

  return (
    <HomeContext
      value={{
        viewMode,
        showFilter,
        searchQuery,
        changeQuery,
        changeViewMode,
        changeSearching,
        changeShowFilter,
        toggleShowFilter,
        changeSearchTerm,
        changeSearchSortBy,
      }}
    >
      {children}
    </HomeContext>
  );
}
