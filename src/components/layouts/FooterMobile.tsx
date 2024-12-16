import React from 'react';
import { useZakeke } from 'zakeke-configurator-react';
import { T } from '../../Helpers';
import useStore from '../../Store';
import styled from 'styled-components';
import { ReactComponent as AngleLeftSolid } from '../../assets/icons/angle-left-solid.svg';
import { ReactComponent as QuoteSolid } from '../../assets/icons/dollar-sign-solid.svg';
import { ReactComponent as PdfSolid } from '../../assets/icons/file-pdf-solid.svg';
import { ReactComponent as ShareSolid } from '../../assets/icons/share-alt-square-solid.svg';
import { ReactComponent as CartSolid } from '../../assets/icons/shopping-cart-solid.svg';
import { MessageDialog, QuestionDialog, useDialogManager } from '../dialog/Dialogs';
import ErrorDialog from '../dialog/ErrorDialog';
import PdfDialog from '../dialog/PdfDialog';
//import ShareDialog from '../dialogs/ShareDialog';
import { FooterMobileContainer, PriceContainer } from './LayoutStyled';

//import QuotationFormDialog from 'components/dialogs/QuotationFormDialog';
import SaveDesignsDraftDialog from '../dialog/SaveDesignsDraftDialog';
import { TailSpin } from 'react-loader-spinner';
import { ReactComponent as SaveSolid } from '../../assets/icons/save-solid.svg';
//import NftDialog, { NftForm } from 'components/dialogs/NftDialog';
import { useRef, useState } from 'react';
//import useDropdown from 'hooks/useDropdown';
import { TooltipContent, AddToCartButton } from '../Atomic';
import QuantityDialog from '../dialog/QuanityDialog'
import LoadingOverlay from "../widgets/LoadingOverlay";

const OutOfStockTooltipContent = styled(TooltipContent)`
	max-width: 400px;
`;

const FooterMobileIcon = styled.div<{
	isHidden?: boolean;
	color?: string;
	backgroundColor?: string;
	iconColor?: string;
	isCart?: boolean;
	disabled?: boolean;
	gridArea?: string;
}>`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	border: 1px transparent solid;
	color: ${(props) => (props.color ? props.color : `#313c46`)};
	// background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : `transparent`)};
	background-color: transparent;
	font-size: 14px;
	text-transform: uppercase;
	text-align: center;
	display: inline-flex;
	min-height: 38px;
	border: none;
	// border-right: 3px #f4f4f4 solid;
	cursor: pointer;

	svg {
		fill: ${(props) => props.iconColor && `${props.iconColor}`};
		width: 27px;
		height: 27px;
	}

	${(props) => props.isHidden && `visibility:hidden`};

	${(props) =>
		props.isCart &&
		`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;`};

	${(props) =>
		props.disabled &&
		`
      background-color: lightgray;
      border: 1px solid gray;
      color: #313c46;
  `}
	${(props) => props.gridArea && `grid-area:${props.gridArea}`};
`;

const FooterMobile = () => {
	//const [openOutOfStockTooltip, , isOutOfStockTooltipVisible, Dropdown] = useDropdown();
	const addToCartButtonRef = useRef<HTMLDivElement>(null);
    const [pdfIsLoading, setPdfIsLoading] = useState<Boolean>(false);

	const {
		useLegacyScreenshot,
		setCameraByName,
		getPDF,
		addToCart,
		product,
		price,
		//isOutOfStock,
		groups,
		isSceneLoading,
		eventMessages,
		isAddToCartLoading,
		sellerSettings,
		saveComposition,
		createQuote,
		nftSettings
	} = useZakeke();

	const {
		setIsLoading,
		selectedGroupId,
		setSelectedGroupId,
		selectedAttributeId,
		setSelectedTemplateGroupId,
		selectedTemplateGroupId,
		selectedStepId,
		setSelectedAttributeId,
		priceFormatter,
		setIsQuoteLoading,
		isQuoteLoading,
		isViewerMode,
		isDraftEditor,
		isEditorMode,
		isMobile
	} = useStore();

	const { showDialog, closeDialog } = useDialogManager();
	const isOutOfStock = false;
	const isBuyVisibleForQuoteRule = product?.quoteRule ? product.quoteRule.allowAddToCart : true;
	const isAddToCartDisabled = isOutOfStock || isAddToCartLoading;

	const handleAddToCart = () => {
		const cartMessage = eventMessages?.find((message) => message.eventID === 4);

		const findSizeIndex = groups.findIndex((obj) => obj.name.toLowerCase() === 'marime');
		const isSizeNotSelected = groups[findSizeIndex]?.attributes[0].options[0].selected === true;
		console.log(isSizeNotSelected,'isSizeNotSelected');
		if (cartMessage && cartMessage.visible && !isDraftEditor && !isEditorMode && !isSizeNotSelected)
			showDialog(
				'question',
				<QuestionDialog
					alignButtons='center'
					eventMessage={cartMessage?.description}
					buttonNoLabel={T._('Cancel', 'Composer')}
					buttonYesLabel={T._('Add to cart', 'Composer')}
					onYesClick={() => {
						// if (nftSettings && nftSettings.isNFTEnabled && !isDraftEditor)
						// 	showDialog(
						// 		'nft',
						// 		<NftDialog
						// 			nftTitle={T._(
						// 				"You're purchasing a customized product together with an NFT.",
						// 				'Composer'
						// 			)}
						// 			nftMessage={T._(
						// 				'To confirm and mint your NFT you need an active wallet compatible with Ethereum. Confirm and add your email and wallet address.',
						// 				'Composer'
						// 			)}
						// 			buttonNoLabel={T._('Skip and continue', 'Composer')}
						// 			buttonYesLabel={T._('Confirm and Purchase', 'Composer')}
						// 			price={nftSettings.priceToAdd + price}
						// 			onYesClick={(nftForm: NftForm) => {
						// 				closeDialog('nft');
						// 				addToCart([], undefined, useLegacyScreenshot, nftForm);
						// 			}}
						// 			onNoClick={() => {
						// 				closeDialog('nft');
						// 				addToCart([], undefined, useLegacyScreenshot);
						// 			}}
						// 		/>
						// 	);
						//else 
						addToCart([], undefined, useLegacyScreenshot);
						closeDialog('question');
					}}
				/>
			);
		// else if (nftSettings && nftSettings.isNFTEnabled && !isDraftEditor)
		// 	showDialog(
		// 		'nft',
		// 		<NftDialog
		// 			nftTitle={T._("You're purchasing a customized product together with an NFT.", 'Composer')}
		// 			nftMessage={T._(
		// 				'To confirm and mint your NFT you need an active wallet compatible with Ethereum. Confirm and add your email and wallet address.',
		// 				'Composer'
		// 			)}
		// 			price={nftSettings.priceToAdd + price}
		// 			buttonNoLabel={T._('Skip and continue', 'Composer')}
		// 			buttonYesLabel={T._('Confirm and Purchase', 'Composer')}
		// 			onYesClick={(nftForm: NftForm) => {
		// 				closeDialog('nft');
		// 				addToCart([], undefined, useLegacyScreenshot, nftForm);
		// 			}}
		// 			onNoClick={() => {
		// 				closeDialog('nft');
		// 				addToCart([], undefined, useLegacyScreenshot);
		// 			}}
		// 		/>
		// 	);
		else if (product && product.quantityRule)
			showDialog(
				'quantity',
				<QuantityDialog
					quantityRule={product.quantityRule}
					onClick={() => {
						closeDialog('quantity');
						addToCart([], undefined, useLegacyScreenshot);
					}}
				/>
			);
		else {

			if(isSizeNotSelected){
				showError('SELECTEAZA MARIME')
				// alert('size not selected')
			}
			else {
				addToCart([], undefined, useLegacyScreenshot);
			}
		}
	};

	const showError = (error: string) => {
		showDialog('error', <ErrorDialog error={'Additional $50'} onCloseClick={() => closeDialog('error')} />);
	};

	// const handleShareClick = async () => {
	// 	setCameraByName('buy_screenshot_camera', false, false);
	// 	showDialog('share', <ShareDialog />);
	// };					
	const handleSaveClick = async () => {
		showDialog('save', <SaveDesignsDraftDialog onCloseClick={() => closeDialog('save')} />);
	};
	const handlePdfClick = async () => {
		try {
			setIsLoading(true);
			setPdfIsLoading(true);
			const url = await getPDF();
			showDialog('pdf', <PdfDialog url={url} onCloseClick={() => closeDialog('pdf')} />);
		} catch (ex) {
			console.log(ex);
			showError(T._('Failed PDF generation', 'Composer'));
		} finally {
			setPdfIsLoading(false);
			setIsLoading(false);
		}
	};
	const handleBackClick = () => {
		if (selectedAttributeId) {
			// console.log('selectedAttributeId');
			setSelectedAttributeId(null);

			const selectedCurrentGroup = groups.find((x) => x.id === selectedGroupId);
			const selectedCurrentStep = selectedCurrentGroup?.steps.find((x) => x.id === selectedStepId);

			if (
				selectedCurrentGroup &&
				((selectedCurrentGroup.attributes.length === 1 && selectedCurrentGroup.templateGroups.length === 0) ||
					(selectedCurrentStep?.attributes.length === 1 && selectedCurrentStep.templateGroups.length === 0))
			) {
				setSelectedGroupId(null);
			}
		} else if (selectedTemplateGroupId) {
			// console.log('selectedTemplateGroupId');
			setSelectedTemplateGroupId(null);

			const selectedCurrentGroup = groups.find((x) => x.id === selectedGroupId);
			const selectedCurrentStep = selectedCurrentGroup?.steps.find((x) => x.id === selectedStepId);

			if (
				selectedCurrentGroup &&
				((selectedCurrentGroup.templateGroups.length === 1 && selectedCurrentGroup.attributes.length === 0) ||
					(selectedCurrentStep?.templateGroups.length === 1 && selectedCurrentStep.attributes.length === 0))
			) {
				setSelectedGroupId(null);
			}
		} else if (selectedGroupId) {
			setSelectedGroupId(null);
		}
	};

	// const handleSubmitRequestQuote = async (formData: any) => {
	// 	let thereIsARequiredFormEmpty = formData.some((form: any) => form.required && form.value === '');
	// 	if (thereIsARequiredFormEmpty)
	// 		showDialog(
	// 			'error',
	// 			<ErrorDialog
	// 				error={T._(
	// 					'Failed to send the quotation since there is at least 1 required field empty.',
	// 					'Composer'
	// 				)}
	// 				onCloseClick={() => closeDialog('error')}
	// 			/>
	// 		);
	// 	else
	// 		try {
	// 			closeDialog('request-quotation');
	// 			setIsQuoteLoading(true);
	// 			setCameraByName('buy_screenshot_camera', false, false);
	// 			await saveComposition();
	// 			await createQuote(formData);
	// 			showDialog(
	// 				'message',
	// 				<MessageDialog message={T._('Request for quotation sent successfully', 'Composer')} />
	// 			);
	// 			setIsQuoteLoading(false);
	// 		} catch (ex) {
	// 			console.error(ex);
	// 			setIsQuoteLoading(false);
	// 			showDialog(
	// 				'error',
	// 				<ErrorDialog
	// 					error={T._(
	// 						'An error occurred while sending request for quotation. Please try again.',
	// 						'Composer'
	// 					)}
	// 					onCloseClick={() => closeDialog('error')}
	// 				/>
	// 			);
	// 		}
	// };

	// const handleGetQuoteClick = async () => {
	// 	let rule = product?.quoteRule;
	// 	if (rule)
	// 		showDialog(
	// 			'request-quotation',
	// 			<QuotationFormDialog getQuoteRule={rule} onFormSubmit={handleSubmitRequestQuote} />
	// 		);
	// };

	return (
		<>
		{pdfIsLoading && 
				<LoadingOverlay />}

			{!isSceneLoading && (
				<FooterMobileContainer isQuoteEnable={product?.quoteRule !== null}>
					<FooterMobileIcon gridArea='back' isHidden={selectedGroupId === null} onClick={handleBackClick}>
						<AngleLeftSolid />
					</FooterMobileIcon>
{/* 
					{
						<FooterMobileIcon gridArea='pdf' onClick={handlePdfClick}>
							<PdfSolid />
						</FooterMobileIcon>
					} */}

					{/* {!isDraftEditor && !isEditorMode && sellerSettings && sellerSettings.canSaveDraftComposition && (
						<FooterMobileIcon gridArea='save' onClick={handleSaveClick}>
							<SaveSolid />
						</FooterMobileIcon>
					)} */}

					{/* {!isEditorMode && sellerSettings && sellerSettings.shareType !== 0 && (
						<FooterMobileIcon gridArea='share' onClick={handleShareClick}>
							<ShareSolid />
						</FooterMobileIcon>
					)} */}
					{/* <FooterMobileIcon>
						<span style={{position: "relative", width: "66vw", fontWeight: "600", fontSize: "80%"}}>{product?.name}</span>
					</FooterMobileIcon> */}

					{/* {isBuyVisibleForQuoteRule && !isViewerMode && ( */}
						<FooterMobileIcon
							gridArea='cart'
							isCart
							iconColor='white'
							color='white'
							ref={addToCartButtonRef}
							// onPointerEnter={() => {
							// 	if (isAddToCartDisabled)
							// 		openOutOfStockTooltip(addToCartButtonRef.current!, 'top', 'top');
							// }}
							disabled={isAddToCartDisabled}
							backgroundColor='#313c46'
							onClick={!isAddToCartDisabled ? () => handleAddToCart() : () => null}
						>
							{/* {!isOutOfStock &&
								price !== null &&
								price > 0 &&
								(!sellerSettings || !sellerSettings.hidePrice) && (
									<PriceContainer isMobile={isMobile}>{priceFormatter.format(price)}</PriceContainer>
								)} */}

							{/* {isOutOfStock && T._('OUT OF STOCK', 'Composer')} */}
							
							<AddToCartButton>
								<span style={{color: 'white'}}>
									{isDraftEditor || isEditorMode
										? T._('Save', 'Composer')
										: T._('Get a quote', 'Composer')}
								</span>
							</AddToCartButton>

							{/* {!isOutOfStock &&
								!isAddToCartLoading &&
								(isDraftEditor || isEditorMode ? <SaveSolid /> : <CartSolid />)}
							{isAddToCartLoading && <TailSpin color='#FFFFFF' height='25px' />} */}
						</FooterMobileIcon>
					{/* )} */}
					{/* {product?.quoteRule && !isViewerMode && !isDraftEditor && !isEditorMode && (
						<FooterMobileIcon
							gridArea='quote'
							iconColor='white'
							color='white'
							backgroundColor='#313c46'
							onClick={handleGetQuoteClick}
						>
							{!isQuoteLoading && <QuoteSolid />}
							{isQuoteLoading && <TailSpin color='#FFFFFF' height='25px' />}
						</FooterMobileIcon>
					)} */}
				</FooterMobileContainer>
			)}

			{/* {isOutOfStockTooltipVisible && (
				<Dropdown>
					<OutOfStockTooltipContent>
						{T._(
							'The configuration you have done is out-of-stock, please select different options to purchase this product.',
							'Composer'
						)}
					</OutOfStockTooltipContent>
				</Dropdown>
			)} */}
		</>
	);
};

export default FooterMobile;
