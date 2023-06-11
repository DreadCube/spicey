import styled from 'styled-components';

interface CircleGradientProps {
    width: string
    height: string

    fromColor: string
    toColor: string

    duration?: string
    fillMode?: string
    delay?: string
}
const CircleGradient = styled.div<CircleGradientProps>`
    width: ${({ width }) => `${width};`}
    height: ${({ height }) => `${height};`}

   background: ${({ fromColor, toColor }) => `radial-gradient(circle at center, ${toColor} var(--x), ${toColor} 0%, ${fromColor} 0%);`}

   @property --x {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 0%;
  }

  @keyframes circle-fadeIn {
    0% {
      --x: 0%;
    }
    100% {
      --x: 100%;
    }
  }

    animation-name: circle-fadeIn;
    animation-duration: ${({ duration = '1.5s' }) => `${duration}`};
    animation-fill-mode: ${({ fillMode = 'forwards' }) => `${fillMode}`};
    animation-delay: ${({ delay = '2s' }) => `${delay}`};
   `;

export default CircleGradient;
