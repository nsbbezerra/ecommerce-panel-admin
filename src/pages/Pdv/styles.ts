import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { blue, grey, lightBlue } from "@mui/material/colors";

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  justify-content: center;
  gap: 15px;
  max-height: 32vh;
  padding: 15px;
  border-radius: 4px;
  background-color: ${grey["200"]};
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${grey["400"]};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${grey["500"]};
  }

  @media (min-width: 380px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 724px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 940px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @media (min-width: 1380px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

export const ProductCard = styled.div`
  width: 100%;
  border-radius: 4px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  background-color: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
`;

export const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 16 /9;
  object-fit: cover;
  object-position: center;
  border-radius: 4px 4px 0px 0px;
`;

export const MenuContainer = styled.div`
  flex-shrink: 0;
  width: 100%;
  border-radius: 4px;
  background-color: ${lightBlue["900"]};
  padding: 8px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.05);
`;

interface Props {
  active: boolean;
}

export const MenuItem = styled.button<Props>`
  width: 200px;
  min-width: 200px;
  border: none;
  background-color: ${(props) =>
    props.active ? "rgba(255,255,255,.1)" : "transparent"};
  padding: 8px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s;

  .menu-icon {
    color: ${(props) => (props.active ? blue["500"] : "#FFF")};
    font-size: 35px;
  }

  .menu-right {
    display: flex;
    flex-direction: column;
    color: ${grey["100"]};
    align-items: start;
  }

  .menu-title {
    font-size: 12px;
  }
  .menu-desc {
    font-size: 13.5px;
    font-weight: 600;
  }

  &:hover {
    background-color: ${(props) => !props.active && "rgba(255, 255, 255, 0.1)"};
  }

  &:active {
    background-color: ${(props) => !props.active && "rgba(255, 255, 255, 0.2)"};
  }
`;

export const PdvContainer = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  max-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  gap: 10px;
`;

export const ProductsContainer = styled(Box)`
  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${grey["400"]};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${grey["500"]};
  }
`;

export const ProductsList = styled.div`
  padding-top: 8px;
  border-radius: 4px;
`;
