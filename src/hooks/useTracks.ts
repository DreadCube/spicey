import { useState, useEffect } from 'react';

import axios from 'axios';

import { Track } from '../types';

const useTracks = (url: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);

  const loadTracks = async (tracksUrl: string) => {
    const res = await axios.get(tracksUrl);

    const foundedTracks: Track[] = res.data.data.map((track) => ({
      id: track.id,
      artworkSrc: track.artwork['150x150'],
      trackName: track.title,
      artist: {
        id: track.user.id,
        name: track.user.name,
        isVerified: track.user.is_verified,
        coverSrc: track.user.cover_photo['2000x'],
        profilePictureSrc: track.user.profile_picture['1000x1000'],
        followers: track.user.follower_count,
        location: track.user.location,
        trackCount: track.user.track_count,
      },
    }));

    setTracks(foundedTracks);
  };

  useEffect(() => {
    loadTracks(url);
  }, [url]);

  return {
    tracks,
  };
};

export default useTracks;
