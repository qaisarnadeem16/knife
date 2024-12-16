
// import 'react-tippy/dist/tippy.css';
// import './App.css';
import React from 'react';

import FooterMobile from './layouts/FooterMobile';
import SelectorMobile from './layouts/mobile/SelectorMobile';
import Viewer from './layouts/Viewer';
import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow:column;
  padding:40px 60px;
  @media (max-width: 1024px) {
    flex-direction: column;
    padding:0px;
    height: 100%;
  }
  @media (min-width: 1024px) {
    width: 100%;
    height: 100%;
  }
`;

export const MobileContainer = styled.div`
  position: relative;
  display:grid;
  grid-template-rows: 1fr auto auto;
  height:100%;
  width:100%;
  overflow:hidden;
`;

export const Top = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 40%;
  min-height:0;

  @media (max-width: 1024px) {
    display:flex;
    flex-direction: column;
  }
`;

function LayoutMobile() {
  return (
    <MobileContainer>
      <Viewer />
      <SelectorMobile />
      <FooterMobile />
    </MobileContainer>
  );
}

export default LayoutMobile;
