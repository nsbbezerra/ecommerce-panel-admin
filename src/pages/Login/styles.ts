import styled from "@emotion/styled";
import { grey } from "@mui/material/colors";

interface ContainerProps {
  image: string;
}

export const LoginContainer = styled.div<ContainerProps>`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
  background-color: ${grey["50"]};
  padding: 10px;
  position: relative;
`;

export const LoginFormContainer = styled.div`
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px 0px;
  border-radius: 4px;
  background-color: #fff;
  max-width: 320px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .inputs-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }
`;

export const AppDescription = styled.span`
  text-align: center;
  font-size: 14px;
`;
