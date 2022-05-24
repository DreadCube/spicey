import React from 'react';

interface AudioProps {
  audioRef: React.LegacyRef<HTMLAudioElement>
  stream: string
}
function Audio({ stream, audioRef }: AudioProps) {
  return (
    <audio crossOrigin="anonymous" style={{ display: 'none' }} ref={audioRef}>
      <source src={stream} type="audio/ogg" />
      <source src={stream} type="audio/mp3" />
      <source src={stream} type="audio/mpeg" />
    </audio>
  );
}

export default Audio;
