import styled from "@emotion/styled";

export const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: relative;

  .video {
    max-width: 100%;
    min-width: 100%;
    min-height: 100%;
    width: 100vw;
    height: 100vh;
    position: fixed;
    right: 0;
    bottom: 0;
    padding: none;
    object-fit: cover;
  }
`;

export const LoginFormContainer = styled.div`
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px 0px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  max-width: 350px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 100;

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
