import { FC, useEffect, useState } from "react";
import { StyledSearch } from "./Search.styled";
import { api } from "../utils/api";
import { WikiSearch } from "backend/src/wikipedia/wikipedia.type";
import { WikiSearchDisplay } from "../types/WikipediaSearchTypes";
import SearchResult from "./SearchResult";
import { suggestedSearches } from "../utils/constants";
import { randomSearchRecommendation } from "../utils/randomeSearchRecommendation";
import { useDebounce } from "usehooks-ts";

type Props = {
  topic: string;
  setTopic: (v: string) => void;
};

const Search: FC<Props> = ({ setTopic, topic }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WikiSearchDisplay[]>([]);
  const [placeholderText, setPlaceholderText] = useState(topic || "Deep Dive");
  const [hasSearchedAtLeastOnce, setHasSearchAtLeastOnce] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const getWikiSearch = async () => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const { data } = await api<WikiSearch>({
      url: "/wikipedia",
      params: { search: debouncedQuery },
    });

    setResults(
      data.query.search.map((search) => ({
        title: search.title,
        snippet: search.snippet,
      }))
    );
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
              setTopic(result.title.toLowerCase());
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
