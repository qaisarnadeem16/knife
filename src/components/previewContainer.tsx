import styled from "styled-components";

export const PreviewContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
`;

export const BlurOverlay = styled.div `position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px); /* Adjust the blur amount as needed */
  background-color: rgba(255, 255, 255, 0.8); /* Adjust the background color and opacity as needed */
  opacity: 1;
  transition: opacity 0.5s;
  `;