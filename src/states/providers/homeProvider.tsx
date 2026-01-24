import { useState, type Dispatch, type ReactNode, type SetStateAction, useMemo, useEffect } from "react";
import { createContext } from "react";

type Props = {
    children: ReactNode
}

export const HomeContext = createContext<{
    viewMode: 'grid' | 'list',
    setViewMode: Dispatch<SetStateAction<"grid" | "list">>,
    isFilterOpen: boolean,
    setIsFilterOpen: Dispatch<SetStateAction<boolean>>,
    searchQuery: string,
    setSearchQuery: Dispatch<SetStateAction<string>>
}>({
    viewMode: 'grid',
    setViewMode: () => { },
    searchQuery: '',
    setSearchQuery: () => { },
    isFilterOpen: true,
    setIsFilterOpen: () => { },
})

export function HomeProvider({ children }: Props) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Automatically hide filters on mobile/tablet on initial load
    useEffect(() => {
        const checkScreenSize = () => {
            // Hide filters on screens smaller than 1024px (tablet and mobile)
            const shouldHideFilters = window.innerWidth < 1024;
            setIsFilterOpen(!shouldHideFilters);
        };

        // Check on mount
        checkScreenSize();

        // Add resize listener to handle orientation changes
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // to prevent unnecessary re-rendering
    const value = useMemo(() => ({
        viewMode,
        setViewMode,
        isFilterOpen,
        setIsFilterOpen,
        searchQuery,
        setSearchQuery
    }), [viewMode, isFilterOpen, searchQuery]);

    return <HomeContext value={value}>
        {children}
    </HomeContext>
}
