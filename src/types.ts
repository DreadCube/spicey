export interface Artist {
  id: string
  name: string
  isVerified: boolean
  coverSrc: string
  profilePictureSrc: string
  followers: number
  location?: string
  trackCount: number
}

export interface Track {
  id: string
  artworkSrc: string
  trackName: string
  artist: Artist
}
