import styled from "@emotion/styled";
import { blue, grey } from "@mui/material/colors";

interface Props {
  isActive: boolean;
}

export const PaymentButton = styled.button<Props>`
  width: 100%;
  border-radius: 4px;
  border: 2px solid ${(props) => (props.isActive ? blue["500"] : grey["200"])};
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 21 / 9;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  img {
    width: 60%;
  }

  .flag {
    background-color: ${blue["500"]};
    color: #fff;
    padding: 15px;
    font-size: 20px;
    transform: rotate(45deg);
    display: flex;
    justify-content: center;
    width: 200px;
    position: absolute;
    top: -8px;
    right: -83px;
  }

  .check-icon {
    transform: rotate(-45deg);
  }

  &:hover {
    background-color: ${(props) => !props.isActive && blue["50"]};
  }

  &:active {
    background-color: ${(props) => !props.isActive && blue["100"]};
  }
`;
