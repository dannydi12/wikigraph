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

const Search: FC = () => {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector((state) => state.graph.currentSearch);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WikiSearchDisplay[]>([]);
  const [placeholderText, setPlaceholderText] = useState(
    currentSearch || "Deep Dive"
  );
  const [hasSearchedAtLeastOnce, setHasSearchAtLeastOnce] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

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
      <input
        className="input-box"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholderText}
      />

      <div className="results">
        {results.map((result) => (
          <SearchResult
            key={result.title}
            result={result}
            onClick={() => {
              setHasSearchAtLeastOnce(true);
              dispatch(setCurrentSearch(result.title.toLowerCase()));
              setQuery("");
              setPlaceholderText(result.title);
            }}
          />
        ))}
      </div>
    </StyledSearch>
  );
};

export default Search;
