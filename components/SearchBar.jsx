function SearchBar({ searchText, setSearchText, styles }) {
    return (
        <form className={styles.searchBar}>
            <input
                type="search"
                style={{ display: "block" }}
                className="px-6 py-4 text-2xl w-full border-black border-2 focus:outline-0 rounded-md"
                placeholder="Search for something here..."
                onChange={(e) => {
                    setSearchText(e.target.value);
                }}
                value={searchText}
            />
        </form>
    );
}

export default SearchBar;
