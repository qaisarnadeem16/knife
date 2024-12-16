import { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import ProgressBar from './ProgressBar';
import { useZakeke } from 'zakeke-configurator-react';

const ProgressBarLoadingBackground = styled.div`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12;
`;

const ProgressBarLoadingContainer = styled.div`
  width: 80vw;
  /* height: 80vh; */
  padding: 10px;
  display: inline-flex;
  padding: 48px 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 4px;
  background: var(--surface-default, #fff);
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.15), 0px 0px 3px 0px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 766px){
   width: 350px;
   height: 140px;
  }
`;

const ProgressBarLoadingOverlay = () => {
  const { isSceneLoading } = useZakeke();
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    let step = 0.3;

    if (!isSceneLoading) setCompleted(100.0);
    else if (isSceneLoading) {
      const interval = setInterval(() => {
        currentProgress += step;
        setCompleted(Math.round((Math.atan(currentProgress / 2) / (Math.PI / 2)) * 100 * 100) / 100);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isSceneLoading]);

  return (
    <ProgressBarLoadingBackground>
      <ProgressBarLoadingContainer>
        <ProgressBar bgColor={'#F46200'} completed={completed} />
      </ProgressBarLoadingContainer>
    </ProgressBarLoadingBackground>
  );
};

export default ProgressBarLoadingOverlay;