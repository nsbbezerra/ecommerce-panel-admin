import styled from "@emotion/styled";

interface Props {
  size: "sm" | "md" | "lg" | "xl" | "2xl" | never;
}

export const Container = styled.div<Props>`
  width: 100%;
  max-width: ${(props) =>
    (props.size === "2xl" && "1536px") ||
    (props.size === "xl" && "1280px") ||
    (props.size === "lg" && "1024px") ||
    (props.size === "md" && "768px") ||
    (props.size === "sm" && "640px")};
  margin: 0 auto;
`;
