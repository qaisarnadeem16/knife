import React, { FC } from 'react';

interface MenuTriggerButtonProps {
  width: number;
  toggleTray: () => void;
}

const MenuTriggerButton: FC<MenuTriggerButtonProps> = ({ width, toggleTray }) => {
  return width > 568 ? (
    <button className="tray-trigger-open-button" onClick={toggleTray}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        role="img"
        width="24px"
        height="24px"
        fill="none"
        id="tray-trigger-button-icon"
      >
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          d="M21 5.25H3M21 12H3m18 6.75H3"
        ></path>
      </svg>
      <span style={{ marginLeft: "3px" }}>Menu</span>
    </button>
  ) : null;
};

export default MenuTriggerButton;