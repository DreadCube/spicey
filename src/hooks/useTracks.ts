import { useState, useEffect } from 'react';

import axios from 'axios';

import { Track } from '../types';

import placeholderImg from '../icons/apple-touch-icon-180x180.png';

const useTracks = (url: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTracks = async (tracksUrl: string) => {
    setIsLoading(true);

    const hosts = await axios.get('https://api.audius.co');

    const host = hosts.data.data[0];

    localStorage.setItem('host', host);

    const res = await axios.get(tracksUrl, {
      baseURL: `${host}/v1`,
      params: {
        app_name: 'SPICEY',
      },
    });

    const foundedTracks: Track[] = res.data.data.map((track) => ({
      id: track.id,
      artworkSrc: track.artwork['150x150'],
      trackName: track.title,
      artist: {
        id: track.user.id,
        name: track.user.name,
        isVerified: track.user.is_verified,
        // TODO: Better Cover Photo as placeholder
        coverSrc: track.user.cover_photo?.['2000x'] || placeholderImg,
        profilePictureSrc: track.user.profile_picture['1000x1000'],
        followers: track.user.follower_count,
        location: track.user.location,
        trackCount: track.user.track_count,
      },
    }));

    setTracks(foundedTracks);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTracks(url);
  }, [url]);

  return {
    tracks,
    isLoading,
  };
};

export default useTracks;
