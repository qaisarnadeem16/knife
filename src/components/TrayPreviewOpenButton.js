import React from "react";

const TrayPreviewOpenButton = ({
  width,
  trayPreviewOpenButton,
  selectedTrayPreviewOpenButton,
  selectTrayPreviewOpenButton,
}) => {
//    console.log(width, 'width');

  return width > 568 ? (
    <>
      {selectedTrayPreviewOpenButton ? 
        <button
          className="tray-preview-open-button"
          onClick={trayPreviewOpenButton}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="24px"
            height="24px"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d={"M5.034 15.527L12 8.561l6.967 6.966"}
            ></path>
          </svg>
        </button>
       : 
        <button
          className="tray-preview-open-button"
          onClick={trayPreviewOpenButton}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            width="24px"
            height="24px"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d={"M18.966 8.476L12 15.443 5.033 8.476"}
            ></path>
          </svg>
        </button>
      }
    </>
  ) : null;
};

export default TrayPreviewOpenButton;
