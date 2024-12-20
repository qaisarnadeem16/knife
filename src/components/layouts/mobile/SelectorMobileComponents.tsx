import { Icon } from "../../Atomic";
import React, { FC, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as ArrowLeftIcon } from "../../../assets/icons/angle-left-solid.svg";
import { ReactComponent as ArrowRightIcon } from "../../../assets/icons/angle-right-solid.svg";
// import {
//   MenuItemIcon,
//   MenuItemImage,
//   MenuItemImagesImage,
//   MenuItemImagesImageWrapper,
//   MenuItemImagesWrapper,
//   MenuItemLabel,
//   MobileItemContainer,
// } from "../LayoutStyled";

import { useZakeke } from "zakeke-configurator-react";

import noImage from "../../../assets/images/no_image.png";
import Tooltip from "../../widgets/tooltip";
// import Tooltip from "components/widgets/tooltip";

export const MobileItemContainer = styled.div<{ selected?: boolean }>`
	align-items: center;
	min-width: 80px;
	max-width: 80px;
	width: 80px;
	height: 75px;
	min-height: 75px;
	max-height: 75px;
	flex: 1;
	display: flex;
	flex-direction: column;
	position: relative;
	opacity: 0;
	transform: translateY(20px);
	animation: fadeIn 0.8s ease-out forwards;
	
	/* Stagger effect for children */
	&:nth-child(1) {
		animation-delay: 0s;
	}
	&:nth-child(2) {
		animation-delay: 0.1s;
	}
	&:nth-child(3) {
		animation-delay: 0.2s;
	}
	&:nth-child(4) {
		animation-delay: 0.3s;
	}
	&:nth-child(5) {
		animation-delay: 0.4s;
	}

	${(props) => props.selected && `background-color: #D3D3D3;`}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;


// Styled component for the image of each menu item
export const MenuItemImage = styled.img<{ isRound?: boolean }>`
	width: 45px;
	height: 45px;
	object-fit: ${(props) => (props.isRound ? 'cover' : 'contain')};
	/* margin-bottom: 20px; */
	border-radius: ${(props) => (props.isRound ? '64px!important' : '0')};
`;

// Styled component for the wrapper of multiple images in a menu item
export const MenuItemImagesWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	position: relative;
	top: -10px;
`;

// Styled component for each image wrapper in the menu item
export const MenuItemImagesImageWrapper = styled.div`
	width: 35px;
	height: 35px;
	&:nth-child(1) {
		border-right: 1px #ddd dotted;
		border-bottom: 1px #ddd dotted;
	}

	&:nth-child(2) {
		border-bottom: 1px #ddd dotted;
	}

	&:nth-child(3) {
		border-right: 1px #ddd dotted;
	}
`;

// Styled component for the label of each menu item
export const MenuItemLabel = styled.span`
	font-size: 10px!important;
	font-weight: 500;
	position: relative;
	/* bottom: 20px; */
	left: 0;
	right: 0;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: wrap;
	/* white-space: nowrap; */
`;

// Styled component for each image in the menu item
export const MenuItemImagesImage = styled.img<{ isRound?: boolean }>`
	width: 100%;
	height: 100%;
	object-fit: cover;
	padding: 3px;
	border-radius: ${(props) => (props.isRound ? '64px!important' : '0')};
`;

// Styled component for the icon of each menu item
export const MenuItemIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40px;
	margin-bottom: 20px;
	width: 64px;
	height: 64px;
`;

// Function to determine the visibility of left and right arrows based on scroll position
const getVisibleArrows = (div: HTMLDivElement) => {
  let showLeft = false;
  let showRight = false;

  if (div.scrollLeft > 0) showLeft = true;

  if (div.scrollWidth - div.clientWidth > div.scrollLeft) showRight = true;

  return [showLeft, showRight];
};

// Props for the container of menu items
interface MenuItemsContainerProps {
  isLeftArrowVisible: boolean;
  isRightArrowVisible: boolean;
  onScrollChange: (value: number) => void;
  scrollLeft: number;
  displayFlex?: boolean;
  height?: number;
  children?: React.ReactNode;
}

// Props for each menu item
interface MenuItemProps {
  selected?: boolean;
  imageUrl?: string | null;
  icon?: React.ReactNode | string | null | undefined;
  label: string;
  onClick: () => void;
  className?: string;
  images?: string[];
  hideLabel?: boolean;
  description?: string | null;
  isRound?: boolean;
  children?: React.ReactNode;
}

// Styled component for the wrapper of menu items
const MenuItemsWrapper = styled.div <{ displayFlex?: boolean; height?: number, }>`
	display: ${(props) => (props.displayFlex ? 'flex' : 'block')};
	max-width: 100%;
	min-height: ${(props) => (props.height !== undefined ? `${props.height}px` : '85px')};
	width: 100%;
  justify-content:center;
  gap:5px;
	overflow-x: auto;
	background-color: #ffffff;
	border-top: 1px #ffffff solid;
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */

	::-webkit-scrollbar {
		display: none;
	}

	span {
		font-size: 16px;
	}
`;

// Styled component for the left arrow
const ArrowCss = css`
	position: absolute;
	left: 10px;
	bottom: 60px;
	/* background-color: #f1f1f1; */
	border-radius: 30px;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 3;
`;

// Styled component for the left arrow
const ArrowLeft = styled.div`
	${ArrowCss};
`;

// Styled component for the right arrow
const ArrowRight = styled.div`
	${ArrowCss};
	left: auto;
	right: 10px;
`;

// Styled component for the left arrow icon
const ArrowLeftIconStyled = styled(Icon)`
	font-size: 22px;
`;

// Styled component for the right arrow icon
const ArrowRightIconStyled = styled(Icon)`
	font-size: 22px;
`;

// Container component for mobile menu items
export const MobileItemsContainer: FC<MenuItemsContainerProps> = ({
  children,
  isLeftArrowVisible,
  isRightArrowVisible,
  onScrollChange,
  displayFlex = true,
  height = 85,
  scrollLeft
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);
  if (ref.current && scrollLeft != null) ref.current.scrollLeft = scrollLeft ?? 0;


  // Update visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        onScrollChange(ref.current.scrollLeft);
        const [showLeft, showRight] = getVisibleArrows(ref.current);
        setShowLeftArrow(showLeft);
        setShowRightArrow(showRight);
      }
    };

    // Initial visiblity
    handleScroll();

    const actualRef = ref.current;
    actualRef?.addEventListener('scroll', handleScroll);
    return () => actualRef?.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MenuItemsWrapper ref={ref} displayFlex={displayFlex} height={height}>
      {showLeftArrow && isLeftArrowVisible && (
        <ArrowLeft>
          <div className="bg-slate-100 mt-5 flex items-center justify-center  rounded-full">
            <ArrowLeftIconStyled>
              {/* <ArrowLeftIcon /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                width="45px"
                height="45px"
                fill="#000000"
                transform="rotate(180)"
              >
                <path d="M419.3 264.8l-61.8 61.8L542.9 512 357.5 697.4l61.8 61.8L666.5 512z" />
              </svg>
            </ArrowLeftIconStyled>
          </div>
        </ArrowLeft>

      )}

      {/* Content */}
      {children}

      {showRightArrow && isRightArrowVisible && (
        <ArrowRight>
          <div className="bg-slate-100 mt-5 flex items-center justify-center  rounded-full">
            <ArrowRightIconStyled>
              {/* <ArrowRightIcon /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                width="40px"
                height="40px"
                fill="#000000"
              >
                <path d="M419.3 264.8l-61.8 61.8L542.9 512 357.5 697.4l61.8 61.8L666.5 512z" />
              </svg>
            </ArrowRightIconStyled>
          </div>
        </ArrowRight>

      )}
    </MenuItemsWrapper>
  );
};

export const MenuItem: FC<MenuItemProps> = (props) => {
  // const { items } = useZakeke();
  // const hasTypeZero = items?.some(obj => obj.type === 0);

  return (
    <>
      <MobileItemContainer onClick={props.onClick} selected={props.selected}>
        {props.description && props.description.length !== 0 && (
          <Tooltip optionDescription={props.description} $isMobile />
        )}
        {props.imageUrl && (
          <MenuItemImage isRound={props.isRound} src={props.imageUrl} alt={props.label} loading='lazy' />
        )}
        {!props.imageUrl && props.icon && <MenuItemIcon>{props.icon}</MenuItemIcon>}
        {props.images && (
          <MenuItemImagesWrapper>
            {[0, 0, 0, 0].map((_, index) => (
              <MenuItemImagesImageWrapper key={index}>
                {props.images!.length > index && (
                  <MenuItemImagesImage
                    isRound={props.isRound}
                    src={props.images ? props.images[index] : noImage}
                    alt={props.label}
                    loading='lazy'
                  />
                )}
              </MenuItemImagesImageWrapper>
            ))}
          </MenuItemImagesWrapper>
        )}
        {!props.hideLabel && <MenuItemLabel>{props.label}</MenuItemLabel>}
      </MobileItemContainer>
    </>
  );
};
