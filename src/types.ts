export interface Track {
    id: string
    artworkSrc: string
    trackName: string
    artist: {
        name: string
        id: string
        isVerified: boolean
    }
}
