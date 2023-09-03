import { styled } from "styled-components";

export const StyledModal = styled.div`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  @keyframes overlay-entry {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes modal-entry {
    from {
      transform: scale(0.5);
    }
    to {
      transform: scale(1);
    }
  }

  .overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: #00000062;
    animation: overlay-entry 0.3s ease forwards;
    cursor: pointer;
  }

  .body {
    max-width: 900px;
    margin: 15px;
    max-height: 90%;
    background-color: white;
    padding: 15px;
    border-radius: 5px;
    position: relative;
    cursor: auto;
    
    box-shadow: 4px 5px 0px 3px #ff4e4e;
    animation: modal-entry 0.1s ease forwards;

    overflow-x: auto;
  }

  .exit {
    position: absolute;
    top: 10px;
    right: 10px;
    transition: background-color 0.3s ease-in-out;
    transition: transform 0.1s ease-in-out;
    background-color: #ff4e4e;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 27px;
    height: 27px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: scale(1.05);
      background-color: #ff3535;
      cursor: pointer;
    }
  }

  @media (min-width: 800px) {
    .body {
      padding: 25px;
    }
  }
`;
