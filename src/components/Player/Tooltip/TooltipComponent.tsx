import React from 'react';

import { TooltipRenderProps } from 'react-joyride';
import styled from 'styled-components';

const StyledTooltipComponent = styled.div`
    background-color: black;
    padding: 20px;
    border: 1px solid rgb(255, 0, 169);
    border-radius: 5px;
`;

export default function TooltipComponent({ step, tooltipProps }: TooltipRenderProps) {
  return (
    <StyledTooltipComponent
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...tooltipProps}
    >
      {step.content}
    </StyledTooltipComponent>
  );
}
