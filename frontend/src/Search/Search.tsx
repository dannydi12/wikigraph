import { FC, useEffect, useState } from "react";
import { StyledSearch } from "./Search.styled";
import { api } from "../utils/api";
import { WikiSearch } from "backend/src/wikipedia/wikipedia.type";
import { WikiSearchDisplay } from "../types/WikipediaSearchTypes";
import SearchResult from "./SearchResult";

type Props = {
  topic: string;
  setTopic: (v: string) => void;
};

const Search: FC<Props> = ({ setTopic, topic }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WikiSearchDisplay[]>([]);

  const getWikiSearch = async () => {
    if (!query) {
      setResults([]);
      return;
    }

    const { data } = await api<WikiSearch>({
      url: "/wikipedia",
      params: { search: query },
    });

    setResults(
      data.query.search.map((search) => ({
        title: search.title,
        snippet: search.snippet,
      }))
    );
  };

  useEffect(() => {
    getWikiSearch();
  }, [query]);

  return (
    <StyledSearch $areResults={!!results.length}>
      <input
        className="input-box"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={topic || "Deep Dive"}
      />

      <div className="results">
        {results.map((result) => (
          <SearchResult
            key={result.title}
            result={result}
            onClick={() => setTopic(result.title.toLowerCase())}
          />
        ))}
      </div>
    </StyledSearch>
  );
};

export default Search;
