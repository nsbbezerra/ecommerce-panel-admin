import styled from "@emotion/styled";

export const HomeConteiner = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  text-align: center;

  img {
    width: 30%;

    @media (max-width: 400px) {
      width: 70%;
    }
    @media (max-width: 800px) {
      width: 50%;
    }
  }
`;
