import { StyledFooter } from "./Footer.styled";

const Footer = () => {
  return (
    <StyledFooter>
      <p className="instructions">
        Click nodes to load more relationships. CMD/CTRL + click to open
        Wikipedia page. Use a computer for the best experience.
      </p>
      <p className="footer-text">
        Compiled by{" "}
        <a href="https://danthebuilder.com" target="_blank">
          Daniel Di Venere
        </a>{" "}
        🤖
      </p>
    </StyledFooter>
  );
};

export default Footer;
