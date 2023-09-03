import { FC, ReactNode } from "react";
import { StyledModal } from "./Modal.styled";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
  dismiss: () => void;
};

const Modal: FC<Props> = ({ children, dismiss }) => {
  return (
    <>
      {createPortal(
        <StyledModal>
          <div className="overlay" onClick={dismiss}>
            <div className="body" onClick={(e) => e.stopPropagation()}>
              <button onClick={dismiss} className="exit">
                &#10005;
              </button>
              {children}
            </div>
          </div>
        </StyledModal>,
        document.body
      )}
    </>
  );
};

export default Modal;
