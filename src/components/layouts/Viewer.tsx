import { ProductQuantityRule, useZakeke, ZakekeViewer } from 'zakeke-configurator-react';
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
import { Dialog, useDialogManager } from '../dialog/Dialogs';
import {
	BottomRightIcons,
	CollapseIcon,
	ExplodeIcon,
	FullscreenIcon,
	RecapPanelIcon,
	SecondScreenIcon,
	TopRightIcons,	
	ViewerContainer,
	ZoomInIcon,
	ZoomOutIcon
} from './LayoutStyled';


const Viewer = () => {
	const ref = useRef<HTMLDivElement | null>(null);
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
		price,
		hasExplodedMode,
		setExplodedMode
	} = useZakeke();

	const [isRecapPanelOpened, setRecapPanelOpened] = useState(
		sellerSettings?.isCompositionRecapVisibleFromStart ?? false
	);

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
	const { setSelectedGroupId, setSelectedStepId, setSelectedAttributeId, isMobile } = useStore();

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

	return (
		<ViewerContainer ref={ref}>
			{!isSceneLoading && <ZakekeViewer />}			
				<>
				{<div style={{ position: "absolute", top: "0.52em", left: "3em", fontWeight: "555"}}>
					<div>{product?.name}</div>
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
