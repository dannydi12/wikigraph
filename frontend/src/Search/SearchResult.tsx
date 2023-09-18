import { FC } from "react";
import { WikiSearchDisplay } from "../types/WikipediaSearchTypes";
import { StyledSearchResult } from "./SearchResult.styled";

type Props = {
  result: WikiSearchDisplay;
  onClick: () => any;
};

const SearchResult: FC<Props> = ({ result, onClick }) => {
  return (
    <StyledSearchResult onClick={onClick}>
      <p className="title">{result.title}</p>
      <p className="snippet" dangerouslySetInnerHTML={{ __html: result.snippet }} />
    </StyledSearchResult>
  );
};

export default SearchResult;
