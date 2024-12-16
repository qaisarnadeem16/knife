import { useZakeke } from 'zakeke-configurator-react';
import { AddToCartButton, Button, Icon, TooltipContent } from '../Atomic';
import SaveDesignsDraftDialog from '../dialog/SaveDesignsDraftDialog';
import { T } from '../../Helpers';
import { TailSpin } from 'react-loader-spinner';
import useStore from '../../Store';
import styled from 'styled-components/macro';
import { ReactComponent as PdfSolid } from '../../assets/icons/file-pdf-solid.svg';
import { ReactComponent as SaveSolid } from '../../assets/icons/save-solid.svg';
import { ReactComponent as ShareSolid } from '../../assets/icons/share-alt-square-solid.svg';
import { MessageDialog, QuestionDialog, useDialogManager } from '../dialog/Dialogs';
import ErrorDialog from '../dialog/ErrorDialog';
import PdfDialog from '../dialog/PdfDialog';
//import ShareDialog from '../dialog/ShareDialog';
import {
	CustomQuotationConfirmMessage,
	ExtensionFieldItem,
	ExtensionFieldsContainer,
	FooterContainer,
	FooterRightElementsContainer,
	PriceContainer,
	QuantityContainer
} from './LayoutStyled';
//import NumericInput from './NumericInput';
//import NftDialog, { NftForm } from 'components/dialogs/NftDialog';
//import useDropdown from 'hooks/useDropdown';
import React, { useRef, useState } from 'react';
import LoadingOverlay from "../widgets/LoadingOverlay";
// import QuotationFormDialog from '../dialog/QuanityDialog';

import QuotationFormDialog from '../dialog/QuotationFormDialog';

const PriceInfoTextContainer = styled.div`
	font-size: 14px;
`;

const OutOfStockTooltipContent = styled(TooltipContent)`
	max-width: 400px;
`;

const Footer = () => {
	//const [openOutOfStockTooltip, closeOutOfStockTooltip, isOutOfStockTooltipVisible, Dropdown] = useDropdown();
	const addToCartButtonRef = useRef<HTMLButtonElement>(null);
	const [pdfIsLoading, setPdfIsLoading] = useState<Boolean>(false);

	const {
		useLegacyScreenshot,
		setCameraByName,
		getPDF,
		addToCart,
		isAddToCartLoading,
		sellerSettings,
		product,
		price,
		//isOutOfStock,
		quantity,
		setQuantity,
		eventMessages,
		//additionalCustomProperties,
		saveComposition,
		createQuote,
		nftSettings,
		translations,
		groups
	} = useZakeke();

	const {
		setIsLoading,
		priceFormatter,
		isQuoteLoading,
		setIsQuoteLoading,
		isViewerMode,
		isDraftEditor,
		isEditorMode
	} = useStore();

	const { showDialog, closeDialog } = useDialogManager();

	const handleAddToCart = () => {

		const cartMessage = eventMessages?.find((message) => message.eventID === 4);
		const staticsVals = translations?.statics;

		const findSizeIndex = groups.findIndex((obj) => obj.name.toLowerCase() === 'marime');
		const isSizeNotSelected = groups[findSizeIndex]?.attributes[0].options[0].selected === true;
		console.log(isSizeNotSelected, 'isSizeNotSelected');

		if (cartMessage && cartMessage.visible && !isDraftEditor && !isEditorMode && !isSizeNotSelected)
			showDialog(
				'question',
				<QuestionDialog
					alignButtons='center'
					eventMessage={cartMessage?.description}
					buttonNoLabel={T._('Cancel', 'Composer')}
					buttonYesLabel={staticsVals?.get('Add to cart')}
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
		else {
			if (isSizeNotSelected) {
				showError('SELECTEAZA MARIME')
				// alert('size not selected')
			}
			else {
				addToCart([], undefined, useLegacyScreenshot);
			}

		}
	};

	const showError = (error: string) => {
		showDialog('error', <ErrorDialog error={error} onCloseClick={() => closeDialog('error')} />);
	};

	const handleShareClick = async () => {
		setCameraByName('buy_screenshot_camera', false, false);
		// showDialog('share', <ShareDialog />);
	};

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
			console.error(ex);
			showError(T._('Failed PDF generation', 'Composer'));
		} finally {
			setPdfIsLoading(false);
			setIsLoading(false);
		}
	};

	const handleSubmitRequestQuote = async (formData: any) => {
		console.log(formData,'formData');
		
		// let thereIsARequiredFormEmpty = formData?.some((form: any) => form.required && form.value === '');
		// if (thereIsARequiredFormEmpty)
		// 	showDialog(
		// 		'error',
		// 		<ErrorDialog
		// 			error={T._(
		// 				'Failed to send the quotation since there is at least 1 required field empty.',
		// 				'Composer'
		// 			)}
		// 			onCloseClick={() => closeDialog('error')}
		// 		/>
		// 	);
		// else
			try {
				closeDialog('request-quotation');
				setIsQuoteLoading(true);
				setCameraByName('buy_screenshot_camera', false, false);
				await saveComposition();
				await createQuote(formData);
				showDialog(
					'message',
					<MessageDialog
						windowDecorator={CustomQuotationConfirmMessage}
						message={T._('Request for quotation sent successfully', 'Composer')}
					/>
				);
				setIsQuoteLoading(false);
			} catch (ex) {
				console.error(ex);
				setIsQuoteLoading(false);
				showDialog(
					'error',
					<ErrorDialog
						error={T._(
							'An error occurred while sending request for quotation. Please try again.',
							'Composer'
						)}
						onCloseClick={() => closeDialog('error')}
					/>
				);
			}
	};

	const handleGetQuoteClick = async () => {
		let rule = product?.quoteRule;
		if (rule)
			showDialog(
				'request-quotation',
				<QuotationFormDialog getQuoteRule={rule} onFormSubmit={handleSubmitRequestQuote} />
			);
	};

	const isOutOfStock = false;
	const isBuyVisibleForQuoteRule = product?.quoteRule ? product.quoteRule.allowAddToCart : true;
	const isAddToCartDisabled = isOutOfStock || isAddToCartLoading;



	return (
		<FooterContainer>
			{/* {T.translations?.statics && ( */}
			<>
				{pdfIsLoading &&
					<LoadingOverlay />}

				{product && product.quantityRule && (
					<QuantityContainer>
						<label>{T._d('Quantity')}</label>
						{/* <NumericInput
								value={quantity}
								readOnly
								onInput={(e: any) => setQuantity(parseFloat(e.currentTarget.value))}
								min={
									product.quantityRule.minQuantity != null
										? Math.max(product.quantityRule.step || 1, product.quantityRule.minQuantity)
										: product.quantityRule.step || 1
								}
								max={
									product.quantityRule.maxQuantity != null
										? product.quantityRule.maxQuantity
										: undefined
								}
								step={product.quantityRule.step != null ? product.quantityRule.step : undefined}
							/> */}
					</QuantityContainer>
				)}
				<FooterRightElementsContainer className='right-footer'>
					{/* Extension Fields */}
					{/* {additionalCustomProperties && (
							<ExtensionFieldsContainer>
								{additionalCustomProperties.map(
									(
										extensionField: {
											name: string;
											value: number;
											label: string;
											formatString: string;
										},
										index
									) => {
										return (
											<ExtensionFieldItem key={index}>
												<span>{T._d(extensionField.label)}</span>
												<div>
													
													{extensionField.value}
												</div>
											</ExtensionFieldItem>
										);
									}
								)}
							</ExtensionFieldsContainer>
						)} */}

					{/* Price */}
					{/* {price !== null && price > 0 && (!sellerSettings || !sellerSettings.hidePrice) && (
							<PriceContainer>
							
								{sellerSettings && sellerSettings.priceInfoText && (
									<PriceInfoTextContainer
										dangerouslySetInnerHTML={{ __html: sellerSettings.priceInfoText }}
									/>
								)}
							</PriceContainer>
						)} */}

					{/* PDF preview */}
					{/* <Button key={'pdf'} onClick={() => handlePdfClick()}>
							<Icon>
								<PdfSolid />
							</Icon>
						</Button> */}

					{/* Save compostition */}
					{!isDraftEditor &&
						!isEditorMode &&
						!isViewerMode &&
						sellerSettings &&
						sellerSettings.canSaveDraftComposition && (
							<Button key={'save'} onClick={() => handleSaveClick()}>
								<Icon>
									<SaveSolid />
								</Icon>
							</Button>
						)
					}

					{/* Share */}
					{/* {sellerSettings && sellerSettings.shareType !== 0 && !isEditorMode && (
							<Button key={'share'} onClick={() => handleShareClick()}>
								<Icon>
									<ShareSolid />
								</Icon>
							</Button>
						)} */}

					{/* Get a quote */}
					{/* {product?.quoteRule && !isViewerMode && !isDraftEditor && !isEditorMode && (
							<Button key={'quote'} primary onClick={() => handleGetQuoteClick()}>
								{isQuoteLoading && <TailSpin color='#FFFFFF' height='25px' />}
								{!isQuoteLoading && <span>{T._('Get a quote', 'Composer')}</span>}
							</Button>
						)} */}

					{/* Add to cart */}
					{/* {isBuyVisibleForQuoteRule && !isViewerMode && ( */}
					<AddToCartButton
						ref={addToCartButtonRef}
						//onPointerEnter={() => {
						// 	if (isAddToCartDisabled) openOutOfStockTooltip(addToCartButtonRef.current!, 'top', 'top');
						// }}
						// onPointerLeave={() => {
						// 	closeOutOfStockTooltip();
						// }}
						disabled={isAddToCartDisabled}
						primary
						//onClick={!isAddToCartDisabled ? () => handleAddToCart() : () => null}
						onClick={() => handleGetQuoteClick()}
					>
						{isAddToCartLoading && <TailSpin color='#FFFFFF' height='25px' />}
						{!isAddToCartLoading && !isOutOfStock && (
							<span>
								{isDraftEditor || isEditorMode
									? T._('Save', 'Composer')
									: T._('Get a quote', 'Composer')}
							</span>
						)}
						{!isAddToCartLoading && isOutOfStock && <span>{T._('OUT OF STOCK', 'Composer')}</span>}
					</AddToCartButton>
					{/* )} */}
				</FooterRightElementsContainer>
			</>
			{/* )} */}
		</FooterContainer>
	);
};

export default Footer;
