import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  ZakekeEnvironment,
  ZakekeViewer,
  ZakekeProvider,
  useZakeke
} from "zakeke-configurator-react";
import Selector from "./selector";
import { DialogsRenderer } from "./dialog/Dialogs";
import useStore from "../Store";
import LayoutMobile from './LayoutMobile';
import FooterMobile from "./layouts/FooterMobile";


// const Layout = styled.div`
//     display: grid;
//     grid-template-columns: auto;
//     grid-gap: 40px;
//     height: 100%;
//     padding: 0px;
//     font-family: "Helvetica Now Text",Helvetica,Arial,sans-serif;
// `

const Layout = styled.div`
  // display: flex; 
  // flex  
  // height: 50%;
  // width: 50%
  // padding: 40px;
  // flex-direction: column;

  position: relative;
  display: grid;
  grid-template-rows: 0fr auto auto;
  height: 100%;
  width: 100%;
  /* background-color: red; */
  overflow: hidden;
`;

const MobileContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr auto auto;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const zakekeEnvironment = new ZakekeEnvironment();

const App: FunctionComponent<{}> = () => {

  const {
    isLoading,
    setPriceFormatter,
    setSelectedAttributeId,
    setSelectedGroupId,
    setSelectedStepId,
    isMobile,
    selectedGroupId,
    setIsMobile
  } = useStore();

  const [resize, setResize] = useState(false);
  const resizeRef = useRef(false);
  resizeRef.current = resize;

  // Update tray preview open button, to update width height for ThreeDRendered
  const [selectedTrayPreviewOpenButton3D, selectTrayPreviewOpenButton3D] =
    useState<boolean | null>(false);

  const trayPreviewOpenButton3DFunc = (
    selectedTrayPreviewOpenButton3D: any
  ) => {
    // console.log(selectedTrayPreviewOpenButton3D,'han bhae');
    selectTrayPreviewOpenButton3D(selectedTrayPreviewOpenButton3D);
  };

  // Page resize
  useEffect(() => {
    const resizeFunction = () => {
      setResize(!resizeRef.current);
    };

    window.addEventListener("resize", resizeFunction);
    return () => window.removeEventListener("resize", resizeFunction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ZakekeProvider environment={zakekeEnvironment}>
      <div id="modal-container" className="css-1q5ttm8">

        {isMobile && <LayoutMobile />}
        {/* {isMobile && (
            <Layout>
              <div style={{ backgroundColor: "rgb(249 246 248)" , width: "100%", border: "0px solid", height: "57%"}}>
                <div
                  className="ThreeDRenderer"
                  style={
                    selectedTrayPreviewOpenButton3D
                      ? { width: "20vw", height: "20vh" }
                      : { 
                        aspectRatio: "1 / 1",
                        width: "93%",  position: "absolute", top: "0em", bottom: "0", left: "3%",
                        backgroundColor: "rgb(249 246 248)" }}
                >
                 <ZakekeViewer />
                </div>
              </div>
              <Selector trayPreviewOpenButton3DFunc={trayPreviewOpenButton3DFunc} />              
            </Layout>            
          )} */}

        {!isMobile && (
          <Layout>
            <div
              style={{
                display: "grid",
                alignItems: "center",
                justifyContent: "center",
                // gridArea: "1 / 2 / 12 / 1",
                backgroundColor: "rgb(249 246 248)",
              }}
            >
              <div
                className="ThreeDRenderer"
                style={
                  selectedTrayPreviewOpenButton3D
                    ? { width: "75vw", height: "75vh" }
                    : { width: "80vw", height: "80vh", marginTop: "26px" }
                }
              >
                <ZakekeViewer />
              </div>
            </div>
            <Selector
              trayPreviewOpenButton3DFunc={trayPreviewOpenButton3DFunc}
            />
          </Layout>
        )}

        {/* {(isLoading || isSceneLoading || isAssetsLoading) && <LoadingOverlay />} */}
        <DialogsRenderer />
      </div>
      {/* </div> */}
    </ZakekeProvider>
  );
};

export default App;