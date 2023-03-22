import styled from "styled-components";

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
  background-color: var(--surface-100);
  padding: 10px;
  position: relative;
`;

export const LoginFormContainer = styled.div`
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px 0px;
  border-radius: var(--border-radius);
  background-color: var(--surface-0);
  backdrop-filter: blur(10px);
  max-width: 320px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .lock-icon {
    font-size: 40px;
    color: var(--primary-500);
  }
  .inputs-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const AppDescription = styled.span`
  text-align: center;
`;
