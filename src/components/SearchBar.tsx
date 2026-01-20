export function SearchBar() {
    return (
        <form className="flex flex-1 items-center justify-center rounded-full bg-secondary md:w-3/4 lg:w-1/2 p-0" role="search">
            <input type="search" role="searchbox" aria-label="Search for Theses, Dissertation, Journal Article and more..." placeholder="Search for Theses, Dissertation, Journal Article, and more..." className="w-full focus:outline-none focus:ring-2 focus:ring-blue-300 px-5 py-7 text-secondary-foreground rounded-full" />
        </form>
    )
}
