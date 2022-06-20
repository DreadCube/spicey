import React from 'react';

import Joyride, { CallBackProps, Step } from 'react-joyride';
import TooltipComponent from './TooltipComponent';
import PlaybackContent from './PlaybackContent';

interface TooltipProps {
  callback: (data: CallBackProps) => void
}
function Tooltip({ callback }: TooltipProps) {
  const styles = {
    options: {
      arrowColor: 'rgb(255,0,169)',
      primaryColor: 'cyan',
    },
  };

  const steps: Step[] = [
    {
      target: '.joyride-controls-playback',
      content: <PlaybackContent />,
      placementBeacon: 'top',
    },
  ];

  return (
    <Joyride
      run={!localStorage.getItem('joyride-complete') && window.innerWidth >= 768}
      steps={steps}
      callback={callback}
      tooltipComponent={TooltipComponent}
      styles={styles}
    />
  );
}

export default Tooltip;
