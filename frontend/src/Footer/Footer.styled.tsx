import styled from "styled-components";

export const StyledFooter = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;

  background-color: #404040;
  padding: 5px 0;

  .instructions {
    position: absolute;
    bottom: 42px;
    width: 100%;
    padding: 0 15px;
    text-align: center;

    font-size: 10px;
    color: #555555;
  }

  .footer-text {
    text-align: center;
    color: white;
    font-weight: 500;
    letter-spacing: 0.4px;
  }

  a {
    color: #3ea6eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: 800px) {
    .instructions {
      font-size: 14px;
    }
  }
`;
