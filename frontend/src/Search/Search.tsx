import { FC, useEffect, useState } from "react";
import { StyledSearch } from "./Search.styled";
import { api } from "../utils/api";
import { WikiSearch } from "backend/src/wikipedia/wikipedia.type";
import { WikiSearchDisplay } from "../types/WikipediaSearchTypes";
import SearchResult from "./SearchResult";
import { suggestedSearches } from "../utils/constants";
import { randomSearchRecommendation } from "../utils/randomeSearchRecommendation";
import { useDebounce } from "usehooks-ts";
import { setCurrentSearch, useAppDispatch, useAppSelector } from "../redux";
import { ReactComponent as SearchIcon } from "./SearchIcon.svg";

const Search: FC = () => {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector((state) => state.graph.currentSearch);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [results, setResults] = useState<WikiSearchDisplay[]>([]);
  const [placeholderText, setPlaceholderText] = useState(currentSearch);
  const [hasSearchedAtLeastOnce, setHasSearchAtLeastOnce] = useState(false);

  const debouncedQuery = useDebounce(searchInputValue, 300);

  const getWikiSearch = async () => {
    try {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      const { data } = await api<WikiSearch>({
        url: "/wikipedia",
        params: { search: debouncedQuery },
      });

      const searchResults = data.query.search.map((search) => ({
        title: search.title,
        snippet: search.snippet,
      }));

      setResults(searchResults);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!hasSearchedAtLeastOnce) {
        const suggestion = randomSearchRecommendation(suggestedSearches);

        setPlaceholderText(suggestion);
      } else {
        clearInterval(intervalId);
      }
    }, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, [hasSearchedAtLeastOnce]);

  useEffect(() => {
    getWikiSearch();
  }, [debouncedQuery]);

  return (
    <StyledSearch $areResults={!!results.length}>
      <div className="input-box">
        <SearchIcon className="search-icon" />
        <input
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          placeholder={placeholderText}
        />
      </div>

      <div className="results">
        {results.map((result) => (
          <SearchResult
            key={result.title}
            result={result}
            onClick={() => {
              window.gtag("event", "search", {
                title: result.title,
              });

              setHasSearchAtLeastOnce(true);
              dispatch(setCurrentSearch(result.title.toLowerCase()));
              setSearchInputValue("");
              setPlaceholderText(result.title);
            }}
          />
        ))}
      </div>
    </StyledSearch>
  );
};

export default Search;
