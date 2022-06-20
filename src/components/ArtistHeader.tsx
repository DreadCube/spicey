import React from 'react';

import styled from 'styled-components';

import followersSvg from '../svgs/followers.svg';
import trackCountSvg from '../svgs/songCount.svg';
import locationSvg from '../svgs/location.svg';

import Text from './Text';
import { Artist } from '../types';

interface ArtistHeaderSectionProps {
  coverSrc: Artist['coverSrc']
}
const ArtistHeaderSection = styled.div<ArtistHeaderSectionProps>`
  height: 300px;
  background-color: black;
  border-radius: 0px;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-size: cover;
  background-color: black;
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

const ArtistHeaderName = styled(Text)`
  font-size: 50px;

  @media only screen and (max-width: 750px) {
    font-size: 25px;
    font-weight: bold;
  }
`;

const InfoText = styled(Text)`
  font-size: 15px;
  margin-left: 5px;
`;

const InfoTextIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
`;

const InfoTextWrapper = styled.div`
  display: flex;
  align-items: end;

  &:not(:first-child) {
    margin-left: 10px;
  }
`;

const InfoTextMainWrapper = styled.div`
  display: flex;
`;

interface ArtistHeaderProps {
  artist: Artist
  isLoading: boolean
}
function ArtistHeader({ artist, isLoading }: ArtistHeaderProps) {
  if (isLoading) {
    return null;
  }
  return (
    <ArtistHeaderSection coverSrc={artist.coverSrc}>
      <ArtistHeaderProfilePicture src={artist.profilePictureSrc} />
      <ArtistHeaderDescription>
        <ArtistHeaderName>{artist.name}</ArtistHeaderName>

        <InfoTextMainWrapper>
          <InfoTextWrapper>
            <InfoTextIcon src={followersSvg} />
            <InfoText>{artist.followers}</InfoText>
          </InfoTextWrapper>
          <InfoTextWrapper>
            <InfoTextIcon src={trackCountSvg} />
            <InfoText>{artist.trackCount}</InfoText>
          </InfoTextWrapper>
          {artist.location
            && (
            <InfoTextWrapper>
              <InfoTextIcon src={locationSvg} />
              <InfoText>{artist.location}</InfoText>
            </InfoTextWrapper>
            )}
        </InfoTextMainWrapper>
      </ArtistHeaderDescription>
    </ArtistHeaderSection>
  );
}

export default ArtistHeader;
