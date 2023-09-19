import { styled } from "styled-components";

export const StyledSearchResult = styled.div`
  background-color: #404040;
  transition: background-color linear 300ms;
  border: 1px solid #6e6e6e;
  border-top-width: 0;

  padding: 10px 20px;

  cursor: pointer;

  &:hover {
    background-color: #353535;
  }

  .title {
    color: #229ced;
    font-size: 16px;
    font-weight: 500;
  }

  .snippet {
    color: #6e6e6e;
    max-width: 100%; /* Set the maximum width you want */
    overflow: hidden; /* Hide any content that overflows the container */
    text-overflow: ellipsis; /* Add an ellipsis (...) for truncated text */
    white-space: nowrap; /* Prevent text from wrapping to the next line */
  }

  .searchmatch {
    color: #3183ba;
  }

  &:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  @media (min-width: 800px) {
    .title {
      font-size: 18px;
      font-weight: 600;
    }
  }
`;
