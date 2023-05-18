import styled from "@emotion/styled";
import { blue, grey } from "@mui/material/colors";

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

export const MenuTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${blue["700"]};
  padding: 7px 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

export const MenuContainer = styled.div`
  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
  background: white;
`;

export const MenuItem = styled.button`
  width: 100%;
  border-right: none;
  border-top: none;
  border-bottom: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 10px;
  border-left-width: 2px;
  border-left-color: transparent;
  color: ${blue["700"]};
  font-size: 13px;
  outline: none;
  transition: all 0.3s;

  &:hover {
    background-color: ${blue["50"]};
    border-left-color: ${blue["700"]};
  }
`;
