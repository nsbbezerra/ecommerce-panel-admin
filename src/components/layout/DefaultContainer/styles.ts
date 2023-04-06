import styled from "@emotion/styled";

interface Props {
  disabledPadding?: boolean;
}

export const ContentContainer = styled.div`
  width: 100%;
  box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
`;

export const DefaultContainer = styled.div<Props>`
  padding: ${(props) => (props.disabledPadding ? "0px" : "20px")};
  width: 100%;
`;
