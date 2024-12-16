import { EditTextItem } from '../widgets/ItemText';
import { EditImageItem } from '../widgets/ItemImage';
import { DialogWindow } from '../dialog/Dialogs';
import styled from 'styled-components/macro';
import { Icon } from '../Atomic';

export const GroupItem = styled.div`
display: flex;
flex-flow: column;
justify-content: center;
align-items: center;
height: 100px;
width: 100px;
margin-bottom: 20px;
text-align: center;
cursor: pointer;
padding: 0px 10px 0px 10px;

&:hover {
    background-color: white;
}

&.selected {
    background-color: white;
}

span {
    font-size: 12px;
}

@media (max-width: 1025px) {
    min-width: 90px;
    padding-right: 5px;
}

@media (max-width: 1024px) {
    min-width: 110px;
    margin-bottom: 0;
    margin-right: 10px;
}
@media (max-width: 42px) {
    min-width: 100px;
}
`;

export const GroupIcon = styled.img`
width: 100%;
height: 40px;
object-fit: contain;
margin-bottom: 10px;
`;


export const TemplatesContainer = styled.div`
	display: flex;
	flex-direction: row;
	grid-gap: 5px;
	align-items: flex-start;
	margin-bottom: 40px;
	overflow: hidden;
	min-height: 0;
`;

export const Template = styled.div<{ selected?: boolean }>`
	padding: 10px;
	cursor: pointer;

	&:hover {
		background-color: #f4f4f4;
	}

	${(props) =>
		props.selected &&
		`
       background-color: #f4f4f4;
    `}
`;


export const SelectContainer = styled.div`
	margin-bottom: 30px;
	padding-bottom: 30px;
	border-bottom: 1px #ccc dotted;
	position: relative;
	// width: 100%;
	span {
		margin-bottom: 10px;
		font-size: 16px;
		display: block;
	}
`;

export const Center = styled.div`
	text-align: center;
	font-size: 18px;
	padding: 30px;
`;

export const CustomQuotationConfirmMessage = styled(DialogWindow)`
	display: flex;
	align-items: center;
	justify-content: center;
`;


export const ZoomInIcon = styled(Icon)<{ isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 32px;
	height: 32px;
	z-index: 3;
	${(props) =>
		props.isMobile
			? `
		top: calc(20%);
		`
			: `top: calc(30%);`}
	@media (max-height: 550px) {
		top: calc(5%);
	}
`;

export const ZoomOutIcon = styled(Icon)<{ isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 32px;
	height: 32px;
	z-index: 3;
	${(props) =>
		props.isMobile
			? `
		top: calc(20% + 50px);
		`
			: `top: calc(30% + 50px);`};
	@media (max-height: 550px) {
		top: calc(5% + 40px);
	}
`;


export const SupportedFormatsList = styled.span`
	font-size: 16px;
	font-style: italic;
	text-align: center;
	color: #313c46;
	padding-top: 5px;
`;

export const ZakekeDesignerContainer = styled.div<{ isMobile?: boolean }>`
	height: 50vh;
	width: 97%;
	position: relative;
	display: flex;
	flex-direction: column;
	background: rgb(235, 237, 242);
	// #ffffff;
	
	${(props) =>
		props.isMobile &&
		`
		position:fixed;
        inset:0;
        z-index:13;
		height: 94%;
		width: 99%;
    `}
`;

export const IconsAndDesignerContainer = styled.div`
	position: absolute;
	left: 0;
	top: calc(50% - 30px);
	z-index: 2;
	display: flex;
	flex-direction: column;
	
`;

export const ItemName = styled.span`
	font-size: 12px;
	font-weight: 600;
`;


export const SelectorMobileContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	width: 100%;
	position: relative;
	overflow: auto;
`;

export const StepsMobileContainer = styled.div`
	border-top: 1px #fff solid;
	height: 45px;
`;

export const MobileItemContainer = styled.div<{ selected?: boolean }>`
    color: #297ca3;
	align-items: center;
	justify-content: center;
	min-width: 140px;
	max-width: 140px;
	width: 140px;
	height: 140px;
	min-height: 140px;
	max-height: 140px;
	flex: 1;
	display: flex;
	flex-direction: column;
	border-right: 2px #fff solid;
	position: relative;
	${(props) => props.selected && `background-color: rgb(235 227 227);`}
`;

export const StepsContainer = styled.div`
	position: relative;
	padding: 0px 20px 20px 20px;

	@media (max-width: 1024px) {
		width: 100%;
		height: 50%;
		flex-direction: column;
		position: relative;
	}
`;

export const MenuItemImage = styled.img<{ isRound?: boolean }>`
	width: 47px;
	height: 47px;
	object-fit: ${(props) => (props.isRound ? 'cover' : 'contain')};
	margin-bottom: 20px;
	border-radius: ${(props) => (props.isRound ? '64px!important' : '0')};
	border: 1px solid rgb(239 233 233);
`;

export const MenuItemImagesWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	position: relative;
	top: -10px;
`;

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

export const MenuItemLabel = styled.span`
	font-size: 13px;
	font-weight: 400;
	position: absolute;
	bottom: 2px;
	left: 0;
	right: 0;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	// white-space: nowrap;
`;

export const MenuItemImagesImage = styled.img<{ isRound?: boolean }>`
	width: 100%;
	height: 100%;
	object-fit: cover;
	padding: 3px;
	border: 1px solid rgb(239, 233, 233);
	border-radius: ${(props) => (props.isRound ? '64px!important' : '0')};
`;

export const MenuItemIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40px;
	margin-bottom: 20px;
	width: 64px;
	height: 64px;
`;


export const ExtensionFieldsContainer = styled.div`
	margin: 0px auto;
	display: flex;
	flex-direction: row;
`;

export const ExtensionFieldItem = styled.div`
	border-right: 1px solid black;
	padding: 0px 5px;
	text-align: right;
`;

export const QuantityContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 70px;
	background-color: white;
	padding-left: 10px;
	color: #313c46;
	grid-gap: 10px;
	/* min-width: 150px; */
	/* input{
		min-width: 100px;
	} */
`;

export const FooterContainer = styled.div`
	background-color: transparent;
	display: flex;
	flex-direction: row;
	height: 70px;
	padding-top: 0px;
	margin-right: 15em;
	width: 26px;
	padding-right: 5em;
	@media screen and (max-width: 568) {
		height: 70px;
	}
`;

export const FooterRightElementsContainer = styled.div`
	background: transparent;
	display: flex;
	justify-content: start;
	width: 100%;
	height: 70px;
	min-height: 70px;
	background-color: transparent;
	flex-direction: row;
	grid-gap: 10px;
	align-items: flex-start;
	padding: 0px 0px 0px 0em;
	font-size: 14px;
	width: 26px;
	@media (max-width: 1024px) {
		min-height: 70px;
	}
`;

export const PriceContainer = styled.div<{ isMobile?: boolean }>`
	font-size: 20px;
	font-weight: 600;
	color: #313c46;
	margin-right: 20px;
	${(props) =>
		props.isMobile &&
		`
    margin-right: 0px;
    color:rgb(41, 124, 163);`};
`;

export const FooterMobileContainer = styled.div<{ isQuoteEnable?: boolean }>`
	z-index: 0;
    height: 55px;
	display: grid;
	grid-template-columns: repeat(1fr), 1fr);
	background-color: #fff;
	font-size: 12px;
	margin-top: 4px;
	border-top: 1px #fff solid;
	grid-template-areas: 'back pdf save share cart'; 
	${(props) => props.isQuoteEnable && `
	grid-template-columns: repeat(6, 1fr);
	grid-template-areas: 'back pdf save share cart quote' 
	`};
`;

export const BottomRightIcons = styled.div`
	position: absolute;
	right: 10px;
	bottom: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 3;
	gap: 20px;
	@media (max-height: 550px) {
		bottom: 20px;
	}
`;


export const CollapseIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const ExplodeIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const FullscreenIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const SecondScreenIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const RecapPanelIcon = styled(Icon)`
	position: absolute;
	left: 20px;
	bottom: 40px;
	width: 32px;
	height: 32px;
	z-index: 3;
	@media (max-height: 550px) {
		bottom: 20px;
	}
`;

export const TopRightIcons = styled.div`
	position: absolute;
	right: 10px;
	top: 10px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 3;
	gap: 20px;
`;

export const ViewerContainer = styled.div`
	position: relative;
	min-height: 0;
	font-family: 'Roboto', sans-serif;

	@media (max-width: 1024px) {
		height: 100%;
	}
`;
