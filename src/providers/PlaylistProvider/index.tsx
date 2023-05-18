import React, {
  createContext, useContext, useMemo, useState,
} from 'react';
import { Track } from '../../helpers/audius/types';

interface PlaylistContext {
  play: (trackId?: string | undefined, providedPlaylist?: Track[] | undefined) => void
  playNext: () => void
  playPrevious: () => void
  setPlaylist: React.Dispatch<React.SetStateAction<Track[]>>
  playlist: Track[]
  playingTrack: Track | null
}
const Context = createContext<PlaylistContext>({
  play: () => {},
  playNext: () => {},
  playPrevious: () => {},
  setPlaylist: () => {},
  playingTrack: null,
  playlist: [],
});

export const usePlaylist = () => useContext(Context);

function PlaylistProvider({ children }) {
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);

  const data = useMemo(() => ({
    // eslint-disable-next-line max-len
    play: (trackId: string | undefined = undefined, providedPlaylist: Track[] | undefined = undefined) => {
      const usedPlaylist = providedPlaylist || playlist;
      const index = trackId
        ? usedPlaylist
          .findIndex((track) => track.id === trackId)
        : 0;

      setPlaylist(usedPlaylist);
      setPlayingTrack(usedPlaylist[index]);
    },
    playNext: () => {
      const index = playlist.findIndex((track) => track.id === playingTrack.id);

      const nextTrack = playlist[index + 1] ? playlist[index + 1] : playlist[0];
      setPlayingTrack(nextTrack);
    },
    playPrevious: () => {
      const index = playlist.findIndex((track) => track.id === playingTrack.id);

      const nextTrack = playlist[index - 1] ? playlist[index - 1] : playlist[playlist.length - 1];
      setPlayingTrack(nextTrack);
    },
    setPlaylist,
    playlist,
    playingTrack,
  }), [playingTrack, playlist]);

  return (
    <Context.Provider value={data}>
      {children}
    </Context.Provider>
  );
}

export default PlaylistProvider;
