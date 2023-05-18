export interface SearchOptions {
    query?: string
    onlyDownloadable?: boolean
}

export interface TrackArtwork {
    _1000x1000?: string
    _150x150?: string
    _480x480?: string
}

export interface TrackElement {
    parent_track_id: string
}

export interface RemixParent {
    tracks?: TrackElement[]
}

export interface CoverPhoto {
    _2000x?: string
    _640x?: string
}

export interface ProfilePicture {
    _1000x1000?: string
    _150x150?: string
    _480x480?: string
    misc?: boolean
}

export interface User {
    album_count: number
    bio?: string
    coverPhoto?: CoverPhoto
    does_follow_current_user?: boolean
    erc_wallet?: string
    followee_count: number
    follower_count: number
    handle: string
    id: string
    is_deactivated: boolean
    is_verified: boolean
    location?: string
    name: string
    playlist_count: number
    profilePicture?: ProfilePicture
    repost_count: number
    spl_wallet: string
    supporter_count: number
    supporting_count: number
    track_count: number
}

export interface Track {
    artwork?: TrackArtwork
    description?: string
    downloadable?: boolean
    duration: number
    favorite_count: number
    genre?: string
    id: string
    mood?: string
    permalink?: string
    play_count?: number
    release_date?: string
    remix_of?: RemixParent
    repost_count: number
    tags?: string
    title: string
    user: User
}

export type UserProfile = {
  userId: number;
  email: string;
  name: string;
  handle: string;
  verified: boolean;
  profilePicture: {'150x150': string, '480x480': string, '1000x1000': string } | { misc: string } | undefined | null
  sub: number;
  iat: string;
}
