import { styled } from "styled-components";

export const StyledSearch = styled.div<{ $areResults: boolean }>`
  position: absolute;
  z-index: 1;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: column;

  margin-top: 30px;

  width: 100%;
  max-width: 80%;

  .input-box {
    display: flex;
    height: 50px;
    border-radius: 10px;
    background-color: #404040;
    border: 1px solid #6e6e6e;
    transition: border-color linear 500ms;
    transition: background-color linear 300ms;
    padding-left: 15px;

    .search-icon {
      width: 25px;
      color: #979797;
    }

    input {
      padding-left: 12px;
      background-color: #404040;
      border: none;
      border-radius: 10px;
      transition: background-color linear 300ms;
      flex-grow: 2;
      color: white;
      font-size: 20px;

      &:focus {
        outline: none;
      }

      &:hover {
        background-color: #353535;
      }
    }

    &:hover {
      background-color: #353535;
    }

    ${({ $areResults }) =>
      $areResults &&
      `border-bottom-right-radius: 0; 
      border-bottom-left-radius: 0;
    `}

    &:focus-within {
      outline: none;
      border: 1px solid #3183ba;
    }
  }

  .results {
    max-height: 500px;
    overflow: scroll;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  @media (min-width: 800px) {
    max-width: 500px;

    .results {
      overflow: auto;
      max-height: none;
    }
  }
`;
