import React, { useCallback, useState } from 'react';
import Intro from './Intro';

import First from './First';

function Rewind2023() {
  const [page, setPage] = useState(0);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  switch (page) {
    case 1:
      return <First nextPage={nextPage} />;

    default:
      return <Intro nextPage={nextPage} />;
  }
}

export default Rewind2023;
