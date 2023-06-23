import { Icon } from '@iconify/react';
import styled from 'styled-components';

interface MenuItem {
  label: string
  onClick: () => void
}

interface MenuProps {
  items: MenuItem[]
}
function Menu({ items = [] }: MenuProps) {
  return (
    <MenuWrapper>
      <MenuIcon icon="mdi:menu" fontSize="30px" />
      <Dropdown>
        {items.map((item) => (<span onClick={item.onClick}>{item.label}</span>))}
      </Dropdown>
    </MenuWrapper>
  );
}

const MenuWrapper = styled.div`
  position: relative;
  margin-left: 10px;

  &:hover > svg {
    border-width: 2px;
  }

  &:hover > div {
    opacity: 1;
    visibility: visible;
    height: auto;
  }

`;

const MenuIcon = styled(Icon)`
  box-sizing: border-box;
  cursor: pointer;

  color: rgb(255,0,169);

  border: 0px solid rgb(255,0,169);
  border-radius: 5px;


  transition: border 0.1s ease-in-out;
`;

const Dropdown = styled.div`
  position: absolute;
  box-sizing: border-box;
  background-color: black;
  border: 2px solid rgb(255,0,169);
  transform: translateX(calc(-100% + 30px));

  color: white;
  font-family: corma;
  width: 200px;

  opacity: 0;
  visibility: hidden;
  border-radius: 5px;

  display: flex;
  flex-direction: column;

  overflow: hidden;
  height: 10px;



  transition: opacity 0.2s ease-in-out, height 0.5s ease-in-out;

  > span {
    padding: 10px;
    cursor: pointer;
  }

  > span:hover {
    background-color: rgb(255,0,169);
    color: black;
  }

  > span:not(:last-child) {
    border-bottom: 1px solid rgb(255,0,169);
  }
`;

export default Menu;
