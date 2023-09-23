import styled from "styled-components";

export const StyledFooter = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;

  background-color: #404040;
  padding: 5px 0;

  p {
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
`;
