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

    ${({ $areResults }) =>
      $areResults &&
      `border-bottom-right-radius: 0; 
      border-bottom-left-radius: 0;
    `}

    padding-left: 20px;
    font-size: 20px;
    flex-grow: 2;

    color: white;

    &:focus {
      outline: none;
      border: 1px solid #3183ba;
    }
  }

  @media (min-width: 800px) {
    max-width: 500px;
  }
`;
