import { ProductQuantityRule, TryOnMode, useZakeke, ZakekeViewer } from 'zakeke-configurator-react';
import { Button } from '../Atomic';
import {
	findAttribute,
	findGroup,
	findStep,
	launchFullscreen,
	quitFullscreen,
	T,
	useActualGroups,
	useUndoRedoActions
} from '../../Helpers';
import React, { useEffect, useRef, useState } from 'react';
import useStore from '../../Store';
import { ReactComponent as BarsSolid } from '../../assets/icons/arrow-left-solid.svg';
import { ReactComponent as DesktopSolid } from '../../assets/icons/arrow-left-solid.svg';
// import { ReactComponent as ExpandSolid } from '../../assets/icons/expand-solid.svg';
import { ReactComponent as CollapseSolid } from '../../assets/icons/arrow-left-solid.svg';
import { ReactComponent as ExplodeSolid } from '../../assets/icons/arrow-left-solid.svg';

import { ReactComponent as SearchMinusSolid } from '../../assets/icons/search-minus-solid.svg';
import { ReactComponent as SearchPlusSolid } from '../../assets/icons/search-plus-solid.svg';
import { Dialog, QuestionDialog, useDialogManager } from '../dialog/Dialogs';
import {
	BottomRightIcons,
	CollapseIcon,
	ExplodeIcon,
	FooterMobileIcon,
	FullscreenArrowIcon,
	FullscreenIcon,
	MobileFooterContainer,
	RecapPanelIcon,
	SecondScreenIcon,
	TopRightIcons,
	ViewerContainer,
	ZoomInIcon,
	ZoomOutIcon
} from './LayoutStyled';
import NftDialog, { NftForm } from '../dialog/NftDialog';
import QuantityDialog from '../dialog/QuanityDialog';
import { TailSpin } from 'react-loader-spinner';
import useDropdown from '../hooks/useDropdown';
import { ReactComponent as SaveSolid } from '../../assets/icons/save-filled.svg';
import { ReactComponent as CartSolid } from '../../assets/icons/cart-filler.svg';
import { ReactComponent as ArrowUpSimple } from '../../assets/icons/up-arrow-simple.svg';
import { ReactComponent as ArrowDownSimple } from '../../assets/icons/down-arrow-simple.svg';
import SaveDesignsDraftDialog from '../dialog/SaveDesignsDraftDialog';


const Viewer = () => {
	const ref = useRef<HTMLDivElement | null>(null);
	const addToCartButtonRef = useRef<HTMLDivElement>(null);
	const {
		isSceneLoading,
		IS_IOS,
		IS_ANDROID,
		getMobileArUrl,
		openArMobile,
		isSceneArEnabled,
		zoomIn,
		zoomOut,
		sellerSettings,
		reset,
		openSecondScreen,
		product,
		hasExplodedMode,
		setExplodedMode,
		hasVTryOnEnabled,
		getTryOnSettings,
		isInfoPointContentVisible,
		visibleEventMessages,
		eventMessages,
		isMandatoryPD,
		isAIEnabled,
		nftSettings,
		price,
		useLegacyScreenshot,
		addToCart,
		setCameraByName,
		getPDF,
		groups,
		saveComposition,
		createQuote,
		isAddToCartLoading,
		isOutOfStock,
	} = useZakeke();

	const {
		// setIsLoading,
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
		setTryOnMode,
		tryOnRef,
		setIsPDStartedFromCart,
		pdValue,
		isMobile,
		setSelectedStepId,
	} = useStore();

	const [isRecapPanelOpened, setRecapPanelOpened] = useState(
		sellerSettings?.isCompositionRecapVisibleFromStart ?? false
	);
	const [openOutOfStockTooltip, , isOutOfStockTooltipVisible, Dropdown] = useDropdown();
	const { showDialog, closeDialog } = useDialogManager();
	const { setIsLoading } = useStore();

	useEffect(() => {
		if (sellerSettings && sellerSettings?.isCompositionRecapVisibleFromStart)
			setRecapPanelOpened(sellerSettings.isCompositionRecapVisibleFromStart);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sellerSettings]);

	const switchFullscreen = () => {
		if (
			(document as any).fullscreenElement ||
			(document as any).webkitFullscreenElement ||
			(document as any).mozFullScreenElement ||
			(document as any).msFullscreenElement
		) {
			quitFullscreen(ref.current!);
		} else {
			launchFullscreen(ref.current!);
		}
	};

	const { setIsUndo, undoStack, setIsRedo, redoStack } = useStore();
	const undoRedoActions = useUndoRedoActions();

	const { undo, redo } = useZakeke();

	const actualGroups = useActualGroups() ?? [];

	const handleRedoSingleStep = (actualRedoStep: { type: string; id: number | null; direction: string }) => {
		if (actualRedoStep.id === null && !isMobile) return;
		if (actualRedoStep.type === 'group')
			return setSelectedGroupId(findGroup(actualGroups, actualRedoStep.id)?.id ?? null);
		if (actualRedoStep.type === 'step')
			return setSelectedStepId(findStep(actualGroups, actualRedoStep.id)?.id ?? null);
		else if (actualRedoStep.type === 'attribute')
			return setSelectedAttributeId(findAttribute(actualGroups, actualRedoStep.id)?.id ?? null);
		else if (actualRedoStep.type === 'option') return redo();
	};

	const isBuyVisibleForQuoteRule = product?.quoteRule ? product.quoteRule.allowAddToCart : true;
	const [disableButtonsByVisibleMessages, setDisableButtonsByVisibleMessages] = useState(false);

	useEffect(() => {
		if (visibleEventMessages && visibleEventMessages.some((msg) => msg.addToCartDisabledIfVisible))
			setDisableButtonsByVisibleMessages(true);
		else setDisableButtonsByVisibleMessages(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visibleEventMessages]);

	const handleAddToCart = () => {
		const cartMessage = eventMessages?.find((message) => message.eventID === 4);
		if (isMandatoryPD && pdValue < 1) {
			setIsPDStartedFromCart(true);
			tryOnRef?.current?.setVisible?.(true);
			tryOnRef?.current?.changeMode?.(TryOnMode.PDTool);
			setTryOnMode(TryOnMode.PDTool);
			return;
		}
		if (cartMessage && cartMessage.visible && !isDraftEditor && !isEditorMode)
			showDialog(
				'question',
				<QuestionDialog
					alignButtons='center'
					eventMessage={cartMessage?.description}
					buttonNoLabel={T._('Cancel', 'Composer')}
					buttonYesLabel={T._('Add to cart', 'Composer')}
					onYesClick={() => {
						if (nftSettings && nftSettings.isNFTEnabled && !isDraftEditor)
							showDialog(
								'nft',
								<NftDialog
									nftTitle={T._(
										"You're purchasing a customized product together with an NFT.",
										'Composer'
									)}
									nftMessage={T._(
										'To confirm and mint your NFT you need an active wallet compatible with Ethereum. Confirm and add your email and wallet address.',
										'Composer'
									)}
									buttonNoLabel={T._('Skip and continue', 'Composer')}
									buttonYesLabel={T._('Confirm and Purchase', 'Composer')}
									price={nftSettings.priceToAdd + price}
									onYesClick={(nftForm: NftForm) => {
										closeDialog('nft');
										addToCart([], undefined, useLegacyScreenshot, nftForm);
									}}
									onNoClick={() => {
										closeDialog('nft');
										addToCart([], undefined, useLegacyScreenshot);
									}}
								/>
							);
						else addToCart([], undefined, useLegacyScreenshot);
						closeDialog('question');
					}}
				/>
			);
		else if (nftSettings && nftSettings.isNFTEnabled && !isDraftEditor)
			showDialog(
				'nft',
				<NftDialog
					nftTitle={T._("You're purchasing a customized product together with an NFT.", 'Composer')}
					nftMessage={T._(
						'To confirm and mint your NFT you need an active wallet compatible with Ethereum. Confirm and add your email and wallet address.',
						'Composer'
					)}
					price={nftSettings.priceToAdd + price}
					buttonNoLabel={T._('Skip and continue', 'Composer')}
					buttonYesLabel={T._('Confirm and Purchase', 'Composer')}
					onYesClick={(nftForm: NftForm) => {
						closeDialog('nft');
						addToCart([], undefined, useLegacyScreenshot, nftForm);
					}}
					onNoClick={() => {
						closeDialog('nft');
						addToCart([], undefined, useLegacyScreenshot);
					}}
				/>
			);
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
			addToCart([], undefined, useLegacyScreenshot);
		}
	};

	const handleSaveClick = async () => {
		showDialog('save', <SaveDesignsDraftDialog onCloseClick={() => closeDialog('save')} />);
	};


	const [isFullscreen, setIsFullscreen] = useState(false);
	const [containerHeight, setContainerHeight] = useState<number | null>(null);

	const switchFullscreenArrows = () => {
		const viewerContainer = ref.current;

		if (document.fullscreenElement) {
			document.exitFullscreen().then(() => {
				setIsFullscreen(false);
			});
		} else {
			setIsFullscreen(true);
			viewerContainer?.requestFullscreen();
		}
	};


	useEffect(() => {
		const handleResize = () => {
			if (isFullscreen && ref.current) {
				ref.current.style.height = `${window.innerHeight}px`;
			}
		};

		if (isFullscreen) {
			window.addEventListener('resize', handleResize);
			handleResize(); // Set initial height on fullscreen
		} else {
			window.removeEventListener('resize', handleResize);
			if (ref.current) ref.current.style.height = 'auto'; // Reset height when exiting fullscreen
		}

		return () => window.removeEventListener('resize', handleResize);
	}, [isFullscreen]);

	return (
		<ViewerContainer ref={ref} className={isFullscreen ? 'fullscreen viewer-container' : 'viewer-container'}>
			{!isSceneLoading && <ZakekeViewer />}
			<>
				{<div className='md:left-[3rem] left-[1rem] md:top-[.52rem] top-[1rem]' style={{ position: "absolute", fontWeight: "555" }}>
					<div className='md:block hidden'>{product?.name}</div>
					<div>USD {price}</div>
				</div>}
				<ZoomInIcon isMobile={isMobile} key={'zoomin'} hoverable onClick={zoomIn}>
					<SearchPlusSolid />
				</ZoomInIcon>
				<ZoomOutIcon isMobile={isMobile} key={'zoomout'} hoverable onClick={zoomOut}>
					<SearchMinusSolid />
				</ZoomOutIcon>

				<BottomRightIcons>
					{hasExplodedMode() && product && !isSceneLoading && (
						<>
							<CollapseIcon hoverable onClick={() => setExplodedMode(false)}>
								<CollapseSolid />
							</CollapseIcon>
							<ExplodeIcon hoverable onClick={() => setExplodedMode(true)}>
								<ExplodeSolid />
							</ExplodeIcon>
						</>
					)}

					{product && product.isShowSecondScreenEnabled && (
						<SecondScreenIcon key={'secondScreen'} hoverable onClick={openSecondScreen}>
							<DesktopSolid />
						</SecondScreenIcon>
					)}

					{/* {!IS_IOS && (
							<FullscreenIcon
								className='fullscreen-icon'
								key={'fullscreen'}
								hoverable
								onClick={switchFullscreen}
							>
								<ExpandSolid />
							</FullscreenIcon>
						)} */}
				</BottomRightIcons>

				{!isSceneLoading && !isFullscreen && (
					<>
						<MobileFooterContainer $isMobile={isMobile} isQuoteEnable={Boolean(product?.quoteRule)}>

							{/* {sellerSettings?.canSaveDraftComposition && ( */}
							<FooterMobileIcon isSaved gridArea="save" onClick={handleSaveClick}>
								<SaveSolid />
							</FooterMobileIcon>


							{/* {isBuyVisibleForQuoteRule && !isViewerMode && ( */}
							<FooterMobileIcon
								isCart
								iconColor='white'
								color='white'
								ref={addToCartButtonRef}
								onPointerEnter={() => {
									if (isOutOfStock) openOutOfStockTooltip(addToCartButtonRef.current!, 'top', 'top');
								}}
								disabled={disableButtonsByVisibleMessages || isAddToCartLoading || isOutOfStock}
								// backgroundColor='#313c46'
								onClick={!isAddToCartLoading ? () => handleAddToCart() : () => null}
							>
								{isOutOfStock && T._('OUT OF STOCK', 'Composer')}

								{!isOutOfStock &&
									!isAddToCartLoading &&
									(isDraftEditor || isEditorMode ? <SaveSolid /> : <CartSolid />)}
								{isAddToCartLoading && <TailSpin color='#FFFFFF' height='25px' />}
							</FooterMobileIcon>
							{/* )} */}

							{/* {product?.quoteRule && !isViewerMode && !isDraftEditor && !isEditorMode && (
								<FooterMobileIcon
									gridArea="quote"
									iconColor="white"
									color="white"
									style={{ fontSize: '14px' }}
									backgroundColor="#313c46"
									disabled={disableButtonsByVisibleMessages}
									onClick={handleGetQuoteClick}
								>
									{!isQuoteLoading ? (
										<>
											<QuoteSolid />
											{T._('Get a Quote', 'Composer')}
										</>
									) : (
										<TailSpin color="#FFFFFF" height="25px" />
									)}
								</FooterMobileIcon>
							)} */}
						</MobileFooterContainer>

						{!IS_IOS && !isSceneLoading && (
							<FullscreenArrowIcon
								$isMobile={isMobile}
								className='fullscreen-icon'
								key={'fullscreen'}
								hoverable
								onClick={switchFullscreenArrows}
							>

								{isFullscreen ? <ArrowUpSimple /> : <ArrowDownSimple />}
							</FullscreenArrowIcon>
						)}
					</>
				)}
				{sellerSettings?.isCompositionRecapEnabled && (
					<RecapPanelIcon key={'recap'} onClick={() => setRecapPanelOpened(!isRecapPanelOpened)}>
						<BarsSolid />
					</RecapPanelIcon>
				)}
				{' '}
			</>
		</ViewerContainer>
	);
};

export default Viewer;
