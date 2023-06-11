import React from 'react';

import CircleGradient from '../../../components/Gradient';

interface FirstProps {
    nextPage: () => void
}
function First({ nextPage }: FirstProps) {
  return (
    <CircleGradient width="100vw" height="100vh" fromColor="#fdf800" toColor="#03D8F3" delay="0s" />
  );
}

export default First;
