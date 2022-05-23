import React from 'react';

import axios from 'axios';
import Loader from './Loader';

function Preloader({ children }) {
  const [preloaded, setPreloaded] = React.useState(false);

  React.useEffect(() => {
    const loadHost = async () => {
      try {
        const hosts = await axios.get('https://api.audius.co');

        const promises = hosts.data.data
          .slice(0, 5)
          .map((host) => axios.get('/v1/tracks/trending?app_name=SPICEY', {
            baseURL: host,
          }));

        const fastestHost = await Promise.any(promises);

        localStorage.setItem('host', fastestHost.config.baseURL);
        setPreloaded(true);
      } catch (err) {
        loadHost();
      }
    };
    loadHost();
  }, []);

  return !preloaded ? <Loader /> : children;
}

export default Preloader;
