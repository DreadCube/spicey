import React from 'react';

import { useParams } from 'react-router-dom';

import Rewind2023 from './2023';

function RewindContainer() {
  const { year } = useParams();

  if (year === '2023') {
    return <Rewind2023 />;
  }

  return null;
}

export default RewindContainer;
