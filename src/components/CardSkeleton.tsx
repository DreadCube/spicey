import React from 'react';

import styled from 'styled-components';

interface SkeletonProps {
  delay: number
}
const Skeleton = styled.div<SkeletonProps>`
  max-width: 160px;
  height: 200px;
  border-radius: 10px;
  display: flex;
  padding: 10px;
  box-shadow: 0px 0px 0px 1px cyan;
  flex-direction: column;
  justify-content: space-between;

  animation-name: pulse;
  animation-duration: 3s;
  animation-delay: ${({ delay }) => delay}ms;
  animation-iteration-count: infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }
  }
`;

const Image = styled.div`
  background: cyan;
  width: 100%;
  height: 70%;
  border-radius: 10px;
`;

const Text = styled.div`
  background: cyan;
  width: 100%;
  height: 30px;
`;

interface CardSkeletonProps {
  delay?: number
}
function CardSkeleton({ delay = 0 }: CardSkeletonProps) {
  return (
    <Skeleton delay={delay}>
      <Image />
      <Text />
    </Skeleton>
  );
}

export default CardSkeleton;
