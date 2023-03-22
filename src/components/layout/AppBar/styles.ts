import styled from "styled-components";

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: var(--surface-0);
  border-bottom: 1px solid var(--surface-border);
  z-index: 10;
  padding: 0 40px;
  box-shadow: rgba(0, 0, 0, 0.05) 5px 4px 9px;
  position: sticky;
  top: 0;

  .header-text {
    display: flex;
    gap: 10px;
    font-weight: bold;
    align-items: center;
  }
  .header-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @media (min-width: 624px) {
    .menu-button {
      display: none;
    }
  }
`;
