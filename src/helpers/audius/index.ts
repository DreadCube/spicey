import {
  SearchOptions, Track, User, UserProfile,
} from './types';

const audius = window.audiusSdk({ appName: 'SPICEY' });

export default {

  /**
   * Search for a track or tracks
   */
  searchTracks: async (searchOptions: SearchOptions = {}): Promise<Track[]> => {
    const tracks = await audius.tracks.searchTracks(searchOptions);

    return tracks.data;
  },

  /**
   * Gets the top 100 trending (most popular) tracks on Audius
   */
  getTrendingTracks: async (): Promise<Track[]> => {
    const tracks = await audius.tracks.getTrendingTracks();
    return tracks.data;
  },

  /**
   * Gets favorites track of provided user
   */
  getFavoritesTracks: async (userId: string): Promise<Track[]> => {
    const favorites = await audius.users.getFavorites({ id: userId });

    const tracks = await audius.tracks.getBulkTracks({
      id: favorites.data.map((fav) => fav.favoriteItemId),
    });

    return tracks.data;
  },

  /**
   * Get the url of the track's streamable mp3 file
   */
  streamTrack: async (trackId: string): Promise<string> => {
    const url = await audius.tracks.streamTrack({
      trackId,
    });
    return url;
  },

  /**
   * Gets a single user by their user ID
   */
  getUser: async (userId: string): Promise<User> => {
    const user = await audius.users.getUser({
      id: userId,
    });

    return user.data;
  },

  /**
   * Gets the tracks created by a user using their user ID
   */
  getTracksByUser: async (userId: string): Promise<Track[]> => {
    const tracks = await audius.users.getTracksByUser({
      id: userId,
    });

    return tracks.data;
  },

  login: () => {
    audius.oauth.login();
  },

  loginInit: (
    // eslint-disable-next-line no-unused-vars
    successCallback: (profile: UserProfile) => void,
    // eslint-disable-next-line no-unused-vars
    errorCallback: (errorMessage: string) => void,
  ) => {
    audius.oauth.init(successCallback, errorCallback);
  },
};
