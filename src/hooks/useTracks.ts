import { useState, useEffect } from 'react';

import axios from 'axios';

import { Track } from '../types';

import placeholderImg from '../icons/apple-touch-icon-180x180.png';

const selectImageSrc = (input) => {
  const entries = Object.entries(input || {});

  entries.sort((a, b) => a[0].localeCompare(b[0]));

  // TODO: Better Cover Photo as placeholder
  return entries.length ? entries[0][1] : placeholderImg;
};

const useTracks = (url: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTracks = async (tracksUrl: string) => {
    setIsLoading(true);

    const res = await axios.get(tracksUrl, {
      baseURL: `${localStorage.getItem('host')}/v1`,
      params: {
        app_name: 'SPICEY',
      },
    });

    const foundedTracks: Track[] = res.data.data.map((track) => ({
      id: track.id,
      artworkSrc: selectImageSrc(track.artwork),
      trackName: track.title,
      artist: {
        id: track.user.id,
        name: track.user.name,
        isVerified: track.user.is_verified,
        coverSrc: selectImageSrc(track.user.cover_photo),
        profilePictureSrc: selectImageSrc(track.user.profile_picture),
        followers: track.user.follower_count,
        location: track.user.location,
        trackCount: track.user.track_count,
      },
    }));

    if (location.pathname.includes('artist')) {
      const withCachedTracks = await loadArtistImages(foundedTracks)
      setTracks(withCachedTracks)
    } else {
      setTracks(foundedTracks);
    }

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

const loadArtistImages = async (tracks: Track[] = []) => {
  const cache = {}
  const formattedTracks = []

  for (const track of tracks) {
    if (!cache[track.artist.id]) {
      const coverSrc = await fetchToBase64(track.artist.coverSrc)
      const profilePictureSrc = await fetchToBase64(track.artist.profilePictureSrc)

      cache[track.artist.id] = {
        coverSrc,
        profilePictureSrc
      }
    }

    formattedTracks.push({
      ...track,
      artist: {
        ...track.artist,
        ...cache[track.artist.id]
      }
    })
  }

  return formattedTracks
}

const fetchToBase64 = async (src) => {
  const base64 = await new Promise(async resolve => {
    const res = await fetch(src)
    const blob = await res.blob()
    const reader = new FileReader()
    reader.onload = result => {
      resolve(result.target.result)
    }
    reader.readAsDataURL(blob)
  })

  return base64
}

export default useTracks;
