import React from 'react';

import styled from 'styled-components';

function Tooltip({ children, title }) {
  return (
    <TooltipContainer>
      <TooltipText>
        {title}
      </TooltipText>
      {children}

    </TooltipContainer>
  );
}

export default Tooltip;

const TooltipContainer = styled.div`
  position: relative;
  cursor: pointer;

  &:hover > span {
    visibility: visible;
    opacity: 1;
    transform: translate(calc(-100% - 10px), 0px);
  }
`;
const TooltipText = styled.span`
  position: absolute;
  visibility: hidden;

  width: max-content;
  transform: translate(calc(-100% - 10px), 20px);
  background-color: black;
  color: white;
  font-family: corma;
  border: 1px solid rgb(255,0,169);
  border-radius: 10px;
  font-size: 12px;
  padding: 10px;

  opacity: 0;
  z-index: 999;

  transition: transform 0.5s linear 0.5s, opacity 0.2s linear 0.5s;


`;
