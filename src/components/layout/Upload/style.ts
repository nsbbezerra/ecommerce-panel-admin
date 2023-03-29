import styled from "@emotion/styled";
import { Box, BoxProps } from "@mui/material";
import { grey } from "@mui/material/colors";

interface Props {
  disabled?: boolean;
}

type DefaultProps = BoxProps & Props;

export const UploadContainer = styled(Box)<DefaultProps>`
  border-radius: 4px;
  border: 1px solid ${grey["300"]};
  overflow: hidden;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "")};
`;

export const UploadButtonsContainer = styled(Box)`
  padding: 15px;
  width: 100%;
  background-color: ${grey["200"]};
`;

export const UploadImageDescription = styled(Box)`
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-direction: column;
`;

export const UploadDescription = styled.span`
  width: 100%;
  display: block;
  text-align: center;
  color: ${grey["500"]};
`;

export const UploadImageContainer = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

export const UploadImage = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 4px;
  flex-shrink: 0;
`;

export const DescriptionContainer = styled.div`
  color: ${grey["700"]};
`;

export const ImageName = styled.span`
  display: block;
  margin-bottom: 10px;
`;

export const ImageDate = styled.span`
  display: block;
  font-size: 12px;
  margin-bottom: 10px;
`;
