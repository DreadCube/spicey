import React from 'react';

import styled from 'styled-components';

import followersSvg from '../svgs/followers.svg';
import trackCountSvg from '../svgs/songCount.svg';
import locationSvg from '../svgs/location.svg';

import { Artist } from './AudioCard';

const ArtistHeaderSection = styled.div`
  height: 300px;
  background-color: black;
  border-radius: 0px;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-size: cover;
  background-image: url('${({ coverSrc }) => coverSrc}');
  position: relative;
`;

const ArtistHeaderProfilePicture = styled.img`
  height: 250px;
  box-shadow: 0 0 10px 0px white;
  z-index: 2;

  @media only screen and (max-width: 750px) {
    position: absolute;
    height: 150px;
    bottom: 0;
    right: 0;
    z-index: 0;
    box-shadow: none;
  }
`;

const ArtistHeaderDescription = styled.div`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: #131313ab;
  padding: 20px;
  height: 160px;
  z-index: 1;
`;

const ArtistHeaderName = styled(Artist)`
  font-size: 50px;

  @media only screen and (max-width: 750px) {
    font-size: 25px;
    font-weight: bold;
  }
`;

function ArtistHeader({ artist }) {
  return (
    <ArtistHeaderSection coverSrc={artist.coverSrc}>
      <ArtistHeaderProfilePicture src={artist.profilePictureSrc} />
      <ArtistHeaderDescription>
        <ArtistHeaderName>{artist.name}</ArtistHeaderName>

        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <img src={followersSvg} style={{ width: 20, height: 20, filter: 'invert(1)' }} />
            <Artist style={{ fontSize: 15, marginLeft: 5 }}>{artist.followers}</Artist>
          </div>
          <div style={{ marginLeft: 10, display: 'flex', alignItems: 'end' }}>
            <img src={trackCountSvg} style={{ width: 20, height: 20, filter: 'invert(1)' }} />
            <Artist style={{ fontSize: 15, marginLeft: 5 }}>{artist.trackCount}</Artist>
          </div>
          {artist.location
            && (
            <div style={{ marginLeft: 10, display: 'flex', alignItems: 'end' }}>
              <img src={locationSvg} style={{ width: 20, height: 20, filter: 'invert(1)' }} />
              <Artist style={{ fontSize: 15, marginLeft: 5 }}>{artist.location}</Artist>
            </div>
            )}
        </div>
      </ArtistHeaderDescription>
    </ArtistHeaderSection>
  );
}

export default ArtistHeader;
