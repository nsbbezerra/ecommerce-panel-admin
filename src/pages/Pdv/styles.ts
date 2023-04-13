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
