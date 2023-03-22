import styled from "styled-components";

interface SideBarProps {
  isOpen: boolean;
}

interface MenuItemProps {
  isOpen: boolean;
  isActive: boolean;
}

export const HomeContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: stretch;
  background-color: var(--surface-100);
`;

export const SideBar = styled.div<SideBarProps>`
  background-color: var(--primary-900);
  height: 100%;
  width: ${(props) => (props.isOpen ? "230px" : "70px")};
  box-shadow: rgba(0, 0, 0, 0.1) 5px 4px 9px;
  transition: all 0.2s;
  position: relative;
  padding-top: 50px;
  flex-shrink: 0;
  z-index: 50;

  @media (max-width: 624px) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    margin-left: ${(props) => (props.isOpen ? "0" : "-100%")};
  }
`;

export const AvatarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .avatar {
    border-radius: 100%;
    transition: all 0.2s;
    border: 2px solid var(--surface-0);
  }
`;

export const CompanyName = styled.span<SideBarProps>`
  color: var(--surface-0);
  font-weight: bold;
  text-align: center;
  transition: all 0.2s;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  padding: 10px;
  margin-top: 10px;
  user-select: none;
`;

export const Menu = styled.nav`
  margin-top: 50px;
  width: 100%;
  max-height: 100%;
  overflow: auto;
`;

export const MenuItem = styled.button<MenuItemProps>`
  border: none;
  background-color: ${(props) =>
    props.isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"};
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  color: var(--surface-0);
  cursor: pointer;
  transition: all 0.2s;
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: ${(props) =>
    props.isActive ? "var(--blue-500)" : "transparent"};
  padding: 12px 0px;

  &:hover {
    background-color: ${(props) =>
      props.isActive ? "" : "rgba(255, 255, 255, 0.1)"};
    border-left-color: ${(props) => (props.isActive ? "" : "var(--blue-500)")};
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .menu-icon {
    display: flex;
    width: ${(props) => (props.isOpen ? "60px" : "57px")};
    justify-content: center;
    overflow: hidden;
    transition: all 0.2s;
    color: var(--surface-0);
  }
  .menu-text {
    display: ${(props) => (props.isOpen ? "block" : "none")};
    overflow: hidden;
    font-weight: bold;
    transition: all 0.2s;
  }
`;

export const AppContent = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
`;
