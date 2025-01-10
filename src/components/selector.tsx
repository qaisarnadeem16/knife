import "./selector.css";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as SearchPlusSolid } from "../assets/icons/search-plus-solid.svg";
import { ReactComponent as SearchMinusSolid } from "../assets/icons/search-minus-solid.svg";
import { useZakeke } from "zakeke-configurator-react";
import {
  List,
  ListItem,
  ListItemColor,
  ListItemImage,
  ListItemImageNoCarousel,
  ListItemColorBig,
  ListItemImageBig
} from "./list";
import { PreviewContainer, BlurOverlay } from "./previewContainer";
import Tray from "./Tray";
import TrayPreviewOpenButton from "./TrayPreviewOpenButton";
import MenuTriggerButton from "./MenuTriggerButton";
import ProgressBarLoadingOverlay from "./widgets/ProgressBarLoadingOverlay";
import Designer from "./layouts/Designer";
import { GroupItem, GroupIcon, MenuItemImagesImage } from "./layouts/LayoutStyled";
import { createPortal } from "react-dom";
import useStore from "../Store";
import { T } from "../Helpers";
import Footer from "./layouts/Footer";
import FooterMobile from "./layouts/FooterMobile";
import Pagination from "swiper";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import { Tooltip } from 'react-tooltip'
import noImage from "../assets/images/no_image.png";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/swiper-bundle.css';
import { ReactComponent as AngleLeftSolid } from "../assets/icons/angle-left-solid.svg";
import { ReactComponent as AngleRightSolid } from "../assets/icons/angle-right-solid.svg";
import Loader from "./Loader";
import { group } from "console";

const dialogsPortal = document.getElementById("dialogs-portal")!;
// const Container = styled.div`
// overflow: auto;
// width: 100%;
// ${!selectedTrayPreviewOpenButton
//     ? css`
//         height: 230px;
//       `
//     : css`
//         height: 70px;
//       `}
// `;

const validCodes: any = ['Seats', 'Shelter', 'Logo', 'Wheels', "Without Wheel Seats 9ft", "With Wheel Seats 9ft",
  "Without Wheel Seats 12ft", "With Wheel Seats 12ft",
  "Without Wheel Seats 15ft", "With Wheel Seats 15ft",
  "Without Wheel Seats 18ft", "With Wheel Seats 18ft",
  "Without Wheel Seats 21ft", "With Wheel Seats 21ft",
  "Without Wheel Seats 24ft", "With Wheel Seats 24ft",
  "Without Wheel Seats 30ft", "With Wheel Seats 30ft",

];

interface TrayPreviewOpenButton3DProps {
  trayPreviewOpenButton3DFunc: (data: any) => void;
}

const Selector: FunctionComponent<TrayPreviewOpenButton3DProps> = ({
  trayPreviewOpenButton3DFunc,
}) => {
  const {
    isSceneLoading,
    isAssetsLoading,
    loadComposition,
    isAddToCartLoading,
    price,
    groups,
    selectOption,
    addToCart,
    templates,
    setTemplate,
    setCamera,
    productName,
    zoomIn,
    zoomOut,
    items,
  } = useZakeke();


  const { setIsLoading, isMobile } = useStore();

  // Keep saved the ID and not the refereces, they will change on each update
  const [selectedGroupId, selectGroup] = useState(1);
  const [selectedStepId, selectStep] = useState<number | null>(null);
  const [selectedAttributeId, selectAttribute] = useState<number | null>(null);
  const [selectedOptionId, selectOptionId] = useState<number | null>(null);
  const [selectedOptionName, selectOptionName] = useState<string | null>(null);

  const [selectedColorName, selectColorName] = useState<any | null>(null);
  const [hasTypeZero, setHasTypeZero] = useState<boolean | null>(null);
  const [stitchTypeGroup, setStitchTypeGroup] = useState<any | null>(null);

  // Get a list of all group names so we can populate on the tray
  const [selectedGroupList, selectGroupList] = useState<any | null>(null);

  // Open tray for menu
  const [isTrayOpen, setIsTrayOpen] = useState<any | null>(false);
  // console.log("grups", groups)
  // Get the id of the selected group from the tray
  const [selectedGroupIdFromTray, selectGroupIdFromTray] = useState<
    number | null
  >(null);

  // Update tray preview open button
  const [selectedTrayPreviewOpenButton, selectTrayPreviewOpenButton] =
    useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState(1);

  const [width, setWidth] = useState(window.innerWidth);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedStep = selectedGroup
    ? selectedGroup.steps.find((step) => step.id === selectedStepId)
    : null;

  const [selectedPersonalize, setSelectedPersonalize] = useState<any | null>(
    false
  );

  const [isNextDisabled, setIsNextDisabled] = useState<any | null>(false)

  const [selectedFilteredAreas, setSelectedFilteredAreas] = useState<number>(0);


  const updateSelectedFilter = (id: number) => {
    setSelectedFilteredAreas(id)
  }


  // Attributes can be in both groups and steps, so show the attributes of step or in a group based on selection
  const attributes = useMemo(
    () => (selectedStep || selectedGroup)?.attributes ?? [],
    [selectedGroup, selectedStep]
  );

  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
  );

  let indexToRemove = groups.findIndex((obj) => obj.id === -1);
  if (indexToRemove !== -1) {
    groups.splice(indexToRemove, 1);
  }

  const hasEnabled = groups[4]?.attributes.some(attribute => attribute.enabled);

  if (!hasEnabled) {
    groups.splice(4, 1);
  }

  useEffect(() => {
    const itemAvailable = items?.filter((item) => item.type === 0).length > 0;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }
  }, [hasTypeZero, groups, items]);

  const dialogsPortal = document.getElementById("dialogs-portal");

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    //window.addEventListener('resize', handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  // Open the first group and the first step when loaded
  useEffect(() => {

    if (items?.some((obj) => obj.type === 0)) {
      setHasTypeZero(items?.some((obj) => obj.type === 0));
    } else {
      setHasTypeZero(false);
    }

    if (!selectedGroup && groups.length > 0) {
      selectGroup(groups[1].id);

      if (groups[1].steps.length > 0) selectStep(groups[1].steps[0].id);

      if (templates.length > 0) setTemplate(templates[0].id);
    }

    if (groups.length > 0) {
      var groupRec: string[] = [];
      groups.map((group) => {
        groupRec.push(group.name);
      });
      selectGroupList(groupRec);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, groups]);




  // useEffect(() => {
  //   const initializeCamera = () => {
  //     if (!groups || groups.length === 0) {
  //       // console.warn("Groups are empty or undefined.");
  //       return;
  //     }

  //     const cameraGroup = groups.find((group) => group.name === "Cams");
  //     if (!cameraGroup || cameraGroup.attributes.length === 0) {
  //       // console.warn("Camera group or attributes are missing.");
  //       return;
  //     }

  //     // Define mobile device breakpoint
  //     // const isMobileDevice = window.innerWidth <= 768;

  //     const options = cameraGroup.attributes[0].options;
  //     // console.log("Is mobile device:", isMobileDevice);

  //     const defaultCamera = isMobile
  //       ? options.find((option) => option.name === "Desktop cam") : options.find((option) => option.name === "Mobile cam")
  //     // console.log("defaultCamera", defaultCamera)
  //     if (defaultCamera) {
  //       selectOption(defaultCamera.id);
  //       selectOptionId(defaultCamera.id);
  //       selectOptionName(defaultCamera.name);
  //     } else {
  //       console.warn("No default camera found for the current device.");
  //     }
  //   };

  //   // Call initialization logic
  //   initializeCamera();
  // }, [groups]);

  // useEffect(() => {
  // 	const textItems = items.filter((item) => item.type === 0) // as TextItem[];
  // 	//const newItems = textItems.filter((item) => !prevItems.some((prevItem) => prevItem.guid === item.guid));
  // 	// newItems.forEach((item) => {
  // 	// 	if (item.isTemplateElement) setItemText(item.guid, T._d(item.text));
  // 	// });
  // 	// setPrevItems(textItems);

  //   textItems.map((item) => {
  //     setItemText(item.guid,'first tezzt')
  //   })

  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [items]);

  // Select attribute first time
  useEffect(() => {
    if (!selectedAttribute && attributes.length > 0)
      selectAttribute(attributes[0].id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute, attributes]);

  useEffect(() => {
    if (selectedGroup) {
      const camera = selectedGroup.cameraLocationId;
      if (camera) setCamera(camera);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  if (isSceneLoading || !groups || groups.length === 0)
    return (
      <PreviewContainer>
        <BlurOverlay>
          {/* <span>Loading scene...</span>; */}
          <ProgressBarLoadingOverlay />
        </BlurOverlay>
      </PreviewContainer>
    );

  if (isAssetsLoading || !groups || groups.length === 0) return <Loader />;

  // console.log(groups[1], groups);

  // groups
  // -- attributes
  // -- -- options
  // -- steps
  // -- -- attributes
  // -- -- -- options

  const handleGroupSelect = (id: number) => {
    // if (items.filter((item) => item.type === 0).length === 0) {
    //   if (groups[groups.length - 1].name === "MODALITATE IMPRIMARE")
    //     if (items?.filter((item) => item.type === 0)) {
    //       groups.splice(groups.length - 1, 1);
    //     }
    // }
    selectGroup(id);
    selectGroupIdFromTray(id);
  };


  const toggleTray = () => {
    if (selectedTrayPreviewOpenButton) {
      selectTrayPreviewOpenButton(!selectedTrayPreviewOpenButton);
    }
    // trayPreviewOpenButton();
    setIsTrayOpen(!isTrayOpen);
  };

  const trayPreviewOpenButton = () => {
    selectTrayPreviewOpenButton(!selectedTrayPreviewOpenButton);

    //trayPreviewOpenButton3DFunc(selectedTrayPreviewOpenButton);
    trayPreviewOpenButton3DFunc(selectedTrayPreviewOpenButton);
  };

  const groupIdFromFunc = (data: any) => {
    //console.log('ayyy',groups,data);
    const filteredArray = groups.filter((group) => group.name === data);
    // const filteredArrayId = groups.filter((group) => group.name === data);

    //  console.log(filteredArrayId, 'sddfasfdafdsf');

    const filteredArrayId = groups.filter((i: any, index: number) => {
      // Perform the desired comparison
      return i.name === data;
    });

    if (filteredArrayId.length > 0) {
      const foundItem = filteredArrayId[0];
      const foundItemIndex = groups.indexOf(foundItem);
      setCurrentIndex(foundItemIndex);
    }

    selectGroup(filteredArray[0].id);
    selectGroupIdFromTray(filteredArray[0].id);
  };

  const togglePersonalize = () => {
    setSelectedPersonalize(!selectedPersonalize);
  };

  const containerStyles = {
    overflow: "auto",
    width: "100%",
    height: !selectedTrayPreviewOpenButton ? "12rem" : "70px",
  };






  const observerErrorHandler = (error: { message: string; }) => {
    if (error.message === "ResizeObserver loop completed with undelivered notifications.") {
      return;
    }
    console.error(error);
  };
  window.addEventListener("error", observerErrorHandler);





  // console.log('selectedGroup', selectedGroup)
  // console.log('Group', groups)
  // console.log('selectOptionName', selectedOptionName)
  return (
    <>
      <div className="top-nav">
        <div className="body-3" id="product-info">
          <span>{productName}</span>
          {/* <span>USD {price}</span> */}
        </div>
      </div>

      {!isMobile && !isTrayOpen ? (
        <div style={{ position: "absolute", top: "36%", bottom: "45%" }}>
          <div className="dgqSKi" onClick={zoomIn}>
            <SearchPlusSolid />
          </div>

          <div className="gwevdV" onClick={zoomOut}>
            <SearchMinusSolid />
          </div>
        </div>
      ) : (
        ""
      )}

      {/* <GroupItem   */}

      {/* Personalize A */}
      {/* {!isMobile && (
        <div
          className="iHdtWA group-item selected"
          style={{
            position: "absolute",
            top: "5%",
            right: "1%",
            cursor: "pointer",
            marginLeft: "20px",
            width: "32vw",
          }}
        >
          <div
            className="button-53"
            onClick={() => setSelectedPersonalize(!selectedPersonalize)}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "7px",
              }}
            >
              {"Customize"}
            </span>
          </div>
          {selectedPersonalize ? (
            <Designer togglePersonalize={togglePersonalize} selectedPersonalize={selectedPersonalize}
              updateSelectedFilter={updateSelectedFilter} selectedFilteredAreas={selectedFilteredAreas} />
          ) : (
            ""
          )}
        </div>
      )} */}

      <div className="animate-wrapper-0">
        {/* Personalize A */}

        <div style={containerStyles}>
          {/* {groups[currentIndex].name === "MODALITATE IMPRIMARE" && (!hasTypeZero) ? null : ( */}
          <div className="tray-header">
            {/* <TrayPreviewOpenButton
              width={width}
              trayPreviewOpenButton={trayPreviewOpenButton}
              selectedTrayPreviewOpenButton={selectedTrayPreviewOpenButton}
              selectTrayPreviewOpenButton={selectTrayPreviewOpenButton}
            /> */}

            <div
              style={{
                display: "flex",
                top: "50%",
                left: "50%",
                width: '100%',
                height: "auto",
                margin: "0px auto",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* {currentIndex > 1 ?
                <button
                  className="previous-customization"
                  onClick={handleLeftClick}
                >
                  <div className="mc-prev">
                    <AngleLeftSolid />
                    Back
                  </div>
                </button> : ''} */}

              {/* {!(selectedOptionName === "Add" && groups[currentIndex]?.name === "Shelter Logo") && ( */}
              <div className="tray-header-1">
                <div
                  style={{
                    position: "absolute",
                    padding: "0px",
                    width: "100%",
                  }}
                >

                  <div >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                        justifyContent: "center",
                        marginTop: "20px"

                      }}
                    >
                      {groups.slice(currentIndex).map((group, index) => {
                        return (
                          <div
                            key={group.id} // Use group.id or fallback to index for the key
                            onClick={() => handleGroupSelect(group.id)} // Assuming `handleGroupSelect` updates `selectGroup`
                            style={{
                              display: "flex",
                              // flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "4px",
                              // margin: "5px",
                              borderRadius: "10px",
                              gap: "5px",
                              textAlign: "center",
                              cursor: "pointer",
                              backgroundColor: selectedGroupId === group.id ? "rgb(229, 229, 229)" : "transparent", // Apply background conditionally
                              fontWeight: selectedGroupId === group.id ? "600" : "400", // Apply background conditionally

                            }}
                          >{index + 1}.
                            <img
                              src={group.imageUrl ?? noImage} // Fallback to noImage if imageUrl is null/undefined
                              alt={group.name || "Group"} // Fallback alt text if name is null/undefined
                              className="w-8 h-14 object-contain rounded-full"
                              style={{
                                marginBottom: "0px"
                              }} // Adjust marginBottom for spacing
                            />
                            <div>{group.name}</div>
                          </div>
                        );
                      })}

                    </div>
                  </div>

                  {/* Tooltip styling for future use */}
                  <Tooltip
                    id={`tooltip-${groups[currentIndex]?.id}`}
                    place="top"
                    style={{
                      zIndex: 9999,
                      padding: "8px",
                      border: "1px solid #000",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
              {/* )} */}

              {/* {currentIndex + 1 !== groups.length && (
                <button className="next-customization" onClick={handleRightClick}>
                  <div className="mc-prev">
                    Next
                    <AngleRightSolid />
                  </div>
                </button>
              )} */}

            </div>

            {!isMobile && <Footer />}

            {/* Closed on request of Paul */}
            {/* <MenuTriggerButton width={width} toggleTray={toggleTray} /> */}
          </div>
          {/* )} */}
          <br />

          {/* <List>
            {groups.map(group => {
                return <ListItem key={group.id} onClick={() => {
                    selectGroup(group.id)
                }} selected={selectedGroup === group}> {group.id === -1 ? 'Other' : group.name}</ListItem>;
            })}
        </List> */}

          <div className={`animate-wrapper${isTrayOpen ? "-2 show" : ""}`}>
            {isTrayOpen && !selectedTrayPreviewOpenButton && (
              <Tray
                groupNameList={selectedGroupList}
                toggleFunc={toggleTray}
                UpdateGroupId={groupIdFromFunc}
              />
            )}
            {selectedGroup &&
              !selectedTrayPreviewOpenButton &&
              selectedGroup.steps.length > 0 &&
              !isTrayOpen && (
                <>
                  <List>
                    {selectedGroup.steps.map((step) => {
                      return (
                        <ListItem
                          key={step.id}
                          onClick={() => selectStep(step.id)}
                          selected={selectedStep === step}
                        >
                          {step.name}
                        </ListItem>
                      );
                    })}
                  </List>
                </>
              )}

            {!selectedTrayPreviewOpenButton && (
              <div style={{ width: "100%" }}>
                {width > 400 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "roboto",
                        textDecoration: "underline",
                      }}
                    >
                      {selectedAttribute?.code === "Shelter Colors" && (
                        <h5>Select Color Family</h5>
                      )}
                      {selectedAttribute &&
                        selectedAttribute.code === "Shelter Colors" &&
                        selectedAttribute.enabled === true &&
                        selectedAttribute.options.length > 0 && (
                          <List>
                            {!selectedTrayPreviewOpenButton &&
                              selectedAttribute.options.map((option) => {
                                if (option.enabled === false) return <></>;
                                return (
                                  <ListItemColor
                                    key={option.id}
                                    onClick={() => {
                                      selectOption(option.id);
                                      selectOptionId(option.id);
                                      selectOptionName(option.name);
                                    }}
                                    selected={option.selected}
                                    selectedColor={selectedColorName}
                                  >
                                    {option.imageUrl && (
                                      <ListItemImageNoCarousel
                                        src={option.imageUrl}
                                        onClick={() =>
                                          selectColorName(option.name)
                                        }
                                        selected={option.selected}
                                      />
                                    )}

                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "105%",
                                      }}
                                    >
                                      {option.id === selectedOptionId
                                        ? option.name
                                        : ""}
                                    </div>
                                  </ListItemColor>
                                );
                              })}
                          </List>
                        )}
                    </div>
                  </>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "roboto",
                    textDecoration: "underline",
                  }}
                >
                  {/* {selectedAttribute?.code === "Shelter Colors" && (
                    <h5 style={{ paddingBottom: "16px" }}>
                      <span>Select Color From Palette</span>
                    </h5>
                  )} */}
                  {selectedGroup &&
                    selectedGroup.attributes &&
                    selectedGroup.attributes.length > 0 && (
                      <List
                      // isShelterColor={
                      //   selectedAttribute?.code === "Shelter Colors"
                      // }
                      >
                        {selectedGroup.attributes.map((opts, i) => {
                          //  if (opts.code !== 'Seats' && opts.code != 'Shelter' && 
                          //  opts.code !=  'Logo' && opts.code !=  'Wheels'
                          //  ) 
                          // console.log('pot-----', opts)
                          if (!validCodes.includes(opts.code)) {
                            if (opts.options.length <= 9) {
                              if (opts.enabled) {
                                return (
                                  opts.enabled &&
                                  opts.options.map((atrOpts) => {
                                    if (atrOpts.enabled) {
                                      return (
                                        <ListItemColor
                                          onClick={() => {
                                            selectOption(atrOpts.id);
                                            selectOptionId(atrOpts.id);
                                            selectOptionName(atrOpts.name);
                                          }}
                                          selected={atrOpts.selected}
                                          selectedColor={selectedColorName}
                                        >
                                          {atrOpts.imageUrl && (
                                            <ListItemImage
                                              src={atrOpts.imageUrl}
                                              selected={atrOpts.selected}

                                            />
                                          )}
                                          <p className="text-[10px] pt-1 max-w-28 w-28 whitespace-normal break-words">
                                            {atrOpts.name}
                                          </p>

                                          {/* <div
                                            style={{
                                              position: "absolute",
                                              top: "100%",
                                            }}
                                          >
                                            {atrOpts.id === selectedOptionId
                                              ? atrOpts.name
                                              : ""}
                                          </div> */}
                                        </ListItemColor>
                                      );
                                    }
                                  })
                                );
                              } else return null;
                            }
                          }
                        })}

                        {selectedGroup.attributes.map((opts, i) => {
                          //  if (opts.code === 'Seats' || opts.code === 'Shelter' || 
                          //  opts.code ===  'Logo' || opts.code ===  'Wheels') {
                          if (validCodes.includes(opts.code)) {
                            if (opts.options.length <= 9) {
                              if (opts.enabled) {
                                return (
                                  opts.enabled &&
                                  opts.options.map((atrOpts) => {
                                    if (atrOpts.enabled) {
                                      return (
                                        <ListItemColorBig
                                          onClick={() => {
                                            selectOption(atrOpts.id);
                                            selectOptionId(atrOpts.id);
                                            selectOptionName(atrOpts.name);
                                          }}
                                          selected={atrOpts.selected}
                                          selectedColor={selectedColorName}
                                        >
                                          {atrOpts.imageUrl && (
                                            <ListItemImageBig
                                              src={atrOpts.imageUrl}
                                            />
                                          )}

                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "100%",
                                            }}
                                          >
                                            {atrOpts.id === selectedOptionId
                                              ? atrOpts.name
                                              : ""}
                                          </div>
                                        </ListItemColorBig>
                                      );
                                    }
                                  })
                                );
                              } else return null;
                            }
                          }
                        })}
                      </List>

                    )}

                  <List>
                    {selectedGroup &&
                      selectedGroup.attributes &&
                      selectedGroup.attributes.map((opts, i) => {
                        // if (opts.enabled === false) return <></>;
                        if (opts.options.length >= 10) {
                          return (
                            <Swiper
                              spaceBetween={10} // Space between slides in pixels
                              // slidesPerView={7} // Show 5 items at a time
                              pagination={{ clickable: true }} // Enable clickable pagination
                              navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                              }}
                              breakpoints={{
                                768: {
                                  slidesPerView: 7, // On screens >= 768px, show 7 items
                                },
                                1024: {
                                  slidesPerView: 7, // On screens >= 1024px, show 12 items
                                },
                                1700: {
                                  slidesPerView: 8, // On screens >= 1024px, show 12 items
                                },
                                2000: {
                                  slidesPerView: 9, // On screens >= 1024px, show 12 items
                                },
                              }}
                              modules={[Navigation]} // Include Navigation module
                              onReachEnd={() => setIsNextDisabled(true)} // Disable "Next" button at the end
                            >
                              <div className="swiper-button-prev"></div>
                              {opts.enabled &&
                                opts.options.map((atrOpts) => (
                                  <SwiperSlide key={atrOpts.id}>
                                    <ListItemColor
                                      onClick={() => {
                                        selectOption(atrOpts.id);
                                        selectOptionId(atrOpts.id);
                                        selectOptionName(atrOpts.name);
                                      }}
                                      selected={atrOpts.selected}
                                      selectedColor={selectedColorName}
                                    >
                                      {atrOpts.imageUrl && <ListItemImage src={atrOpts.imageUrl} />}
                                      <p className="text-[10px] pt-1 max-w-28 w-28 whitespace-normal break-words">
                                        {atrOpts.name}
                                      </p>

                                      {/* <div
                                        style={{
                                          position: "absolute",
                                          top: "70%",
                                        }}
                                      >
                                        {atrOpts.id === selectedOptionId ? atrOpts.name : ""}
                                      </div> */}
                                    </ListItemColor>
                                  </SwiperSlide>
                                ))}

                              <div
                                className={`swiper-button-next ${isNextDisabled ? "swiper-button-disabled" : ""
                                  }`}
                              ></div>
                            </Swiper>

                            // <div className="max-w-[1100px] items-center justify-center min-w-[500px] flex flex-wrap ">
                            //   {opts.enabled &&
                            //     opts.options.map((atrOpts) => (
                            //       <div key={atrOpts.id}>
                            //         <ListItemColor
                            //           onClick={() => {
                            //             selectOption(atrOpts.id);
                            //             selectOptionId(atrOpts.id);
                            //             selectOptionName(atrOpts.name);
                            //           }}
                            //           selected={atrOpts.selected}
                            //           selectedColor={selectedColorName}
                            //         >
                            //           {atrOpts.imageUrl && (
                            //             <ListItemImage src={atrOpts.imageUrl}
                            //               selected={atrOpts.selected}
                            //             />
                            //           )}
                            //           <div className="text-[10px] max-w-28 block text-wrap">{atrOpts.name}</div>

                            //           {/* <p className="text-xs">
                            //             {atrOpts.name}
                            //           </p> */}
                            //           {/* <div
                            //             style={{
                            //               position: "absolute",
                            //               top: "70%",
                            //             }}
                            //           >
                            //             {atrOpts.id === selectedOptionId
                            //               ? atrOpts.name
                            //               : ""}
                            //           </div> */}
                            //         </ListItemColor>
                            //       </div>
                            //     ))}
                            // </div>
                          );
                        }
                      })}
                  </List>


                  <div>
                    {/* <List>
                      {selectedGroup &&
                        selectedGroup.attributes &&
                        // selectedGroup.attributes?.name =! 'Shelter Colors' &&
                        selectedGroup.attributes.map((opts, i) => {
                          if (opts.enabled === false) return <></>;
                          if (i > 0 && (opts.name != 'White' && opts.name != 'Black' && opts.name != 'Molded Seats Colors' && opts.name != 'Seats') && opts.enabled && opts.options.length <= 16) {
                            if (!validCodes.includes(opts.code)) {
                              return opts.options.map((atrOpts) => (
                                <ListItemColor
                                  key={atrOpts.id} // Always include a unique key when rendering lists
                                  onClick={() => {
                                    selectOption(atrOpts.id);
                                    selectOptionId(atrOpts.id);
                                    selectOptionName(atrOpts.name);
                                  }}
                                  selected={atrOpts.selected}
                                  selectedColor={selectedColorName}
                                >
                                  {atrOpts.imageUrl && (
                                    <ListItemImage src={atrOpts.imageUrl} />
                                  )}

                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "96%",
                                    }}
                                  >
                                    {atrOpts.id === selectedOptionId ? atrOpts.name : ""}
                                  </div>
                                </ListItemColor>
                              ));
                            }
                          } else {
                            // Ensure map always returns something, even if it's null
                            return null;
                          }
                        })}
                    </List> */}
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  );
};

export default Selector;
