import { useZakeke } from "zakeke-configurator-react";
import { T } from "../../Helpers";
import React, { FC, useEffect, useRef } from "react";
import styled from "styled-components/macro";
// import { ReactComponent as CheckSolid } from '../../assets/icons/check-circle-solid_1.svg';
// import { Icon } from 'components/Atomic';

const LoadingLabel = styled.div`
  color: #000;
  font-size: 12px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
`;

const LoaderContainer = styled.div`
  height: 10px;
  width: 600px;
  /* width: 76vw; */
  // height: 80vh;
  border-radius: 4px;
  background-color: #dbe2e6;

  @media screen and (max-width: 766px) {
    width: 310px;
  }
`;

const LoadingPercentageLabel = styled.span`
  color: #8fa4ae;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  font-style: normal;
  font-family: "Roboto";
`;

const LoadingPercentageandIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

// const CheckIcon = styled(Icon)`
//   cursor: unset;
//   color: #008556;
// `;

const LoaderFill = styled.div`
  height: 100%;
  border-radius: 4px;
  margin: 7px 0px;
  width: ${({ completed }) => completed && `${completed}%`};
  background-color: #008556;
  border-radius: "inherit";

   @media (max-width: 768px) { /* Adjust the breakpoint as needed */
      margin: 0px 0px;

  }
`;

// const VideoPlayer = styled.video`
//   width: 76.5vw;
//   height: 67vh;

//   @media (max-width: 768px) { /* Adjust the breakpoint as needed */
//     height: auto;
//   }
// `;


const ProgressBar = ({ bgColor, completed }) => {
  const { isSceneLoading, translations } = useZakeke();
  const dynamicVals = translations?.dynamics;

  // const videoRef = useRef(null);


  // useEffect(() => {
  //   const video = videoRef.current;
  //   video.muted = true; // Mute the video to allow autoplay
  //   video.play();

  //   const handleVideoEnd = () => {
  //     console.log("Video has played completely at least once.");
  //     video.play()
  //   };

  //   const handleMetadataLoaded = () => {
  //     console.log(`Video duration: ${video.duration} seconds`);
  //   };

  //   video.addEventListener('ended', handleVideoEnd);

  //   // Unmute the video after it starts playing (optional)
  //   video.addEventListener('playing', () => {
  //     video.muted = true;
  //   });

  //   return () => {
  //     video.removeEventListener('ended', handleVideoEnd);
  //     video.removeEventListener('loadedmetadata', handleMetadataLoaded);
  //   };
  // }, []);



  return (
    <div>
      {/* <VideoPlayer ref={videoRef} id="myVideo" controls aut>
        <source src="intro_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </VideoPlayer> */}

      <LoadingLabel>
        {/* {console.log(T.d('Loading..'),'esfdfsfdssfds');} */}
        {dynamicVals?.get("Loading...")}

        {isSceneLoading ? T._('Loading your product...', 'Composer') : T._('Loading complete.', 'Composer')}
      </LoadingLabel>
      <LoaderContainer>
        <LoaderFill
          completed={isSceneLoading ? completed : 100}
          bgColor={bgColor}
          isCompleted={!isSceneLoading}
        />
        <LoadingPercentageandIconContainer>
          <LoadingPercentageLabel>
            {isSceneLoading ? `${completed}%` : "100%"}
            {/* {isSceneLoading ? T._('In progress | ', 'Composer') + `${completed}%` : '100%'} */}
          </LoadingPercentageLabel>
          {/* // {!isSceneLoading && (
            // <CheckIcon>
            //   <CheckSolid />
            // </CheckIcon>
          )} */}
        </LoadingPercentageandIconContainer>
      </LoaderContainer>
    </div>
  );
};

export default ProgressBar;
