import React from 'react';

import styled from 'styled-components';
import Text from '../../Text';

const PlaybackContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const PlaybackMainText = styled(Text)`
    margin-bottom: 20px;
    font-weight: bold;
`;

const PlaybackMarkersWrapper = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: column;
`;

const PlaybackMarkersTitle = styled(Text)`
    margin-bottom: 10px;
    font-weight: bold;
`;

const PlaybackMarkersTextWithMargin = styled(Text)`
    margin-top: 10px;
`;

export default function PlaybackContent() {
  return (
    <PlaybackContentWrapper>
      <PlaybackMainText>
        The playback line. There are some spicey controls for you:
      </PlaybackMainText>

      <Text type="secondary">
        Spacebar:
      </Text>
      <Text>
        Pause / Play the audio
      </Text>

      <PlaybackMarkersWrapper>
        <PlaybackMarkersTitle>
          Set some markers to skip to the favorite parts of your track!
        </PlaybackMarkersTitle>
        <PlaybackMarkersTextWithMargin type="secondary">Enter:</PlaybackMarkersTextWithMargin>
        <Text>Adds a marker at current play position</Text>

        <PlaybackMarkersTextWithMargin type="secondary">Shift:</PlaybackMarkersTextWithMargin>
        <Text>Jump to the next marker</Text>

        <PlaybackMarkersTextWithMargin type="secondary">Alt:</PlaybackMarkersTextWithMargin>
        <Text>Delete all track markers</Text>
      </PlaybackMarkersWrapper>
    </PlaybackContentWrapper>
  );
}
