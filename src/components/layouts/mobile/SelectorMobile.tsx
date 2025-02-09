import React from 'react';
import { useEffect, useState, FC, } from 'react';
import { Option, Step, ThemeTemplateGroup, useZakeke } from 'zakeke-configurator-react';
import { T, useActualGroups, useUndoRedoActions, useUndoRegister } from '../../../Helpers';
import { Map } from 'immutable';
import useStore from '../../../Store';
import styled from 'styled-components/macro';
import savedCompositionsIcon from '../../../assets/icons/arrow-left-solid.svg';
import star from '../../../assets/icons/star.svg';
import noImage from '../../../assets/images/no_image.png';
import Designer from '../Designer';
import DesignsDraftList from '../DesignsDraftList';
import { ItemName, SelectorMobileContainer, StepsMobileContainer, Template, TemplatesContainer } from '../LayoutStyled';
import Steps from '../Steps';
import { MenuItem, MobileItemsContainer } from './SelectorMobileComponents';
import TemplateGroup from '../../TemplateGroup';
import { PreviewContainer, BlurOverlay } from '../../previewContainer';
import ProgressBarLoadingOverlay from "../..//widgets/ProgressBarLoadingOverlay";

const PriceInfoTextContainer = styled.div`
	font-size: 14px;
	padding: 0px 10px;
`;

const SelectorMobile = () => {
	const {
		isSceneLoading,
		templates,
		currentTemplate,
		setCamera,
		setTemplate,
		sellerSettings,
		groups,
		selectOption,
		draftCompositions,
	} = useZakeke();
	const {
		selectedGroupId,
		setSelectedGroupId,
		selectedAttributeId,
		setSelectedAttributeId,
		selectedStepId,
		setSelectedStepId,
		isUndo,
		isMobile,
		isRedo,
		setSelectedTemplateGroupId,
		selectedTemplateGroupId,
		lastSelectedItem,
		setLastSelectedItem
	} = useStore();
	const [scrollLeft, setScrollLeft] = useState<number | null>(null);
	const [optionsScroll, setOptionsScroll] = useState<number | null>(null);
	const [attributesScroll, setAttributesScroll] = useState<number | null>(null);
	const [isTemplateEditorOpened, setIsTemplateEditorOpened] = useState(false);
	const [isDesignsDraftListOpened, setisDesignsDraftListOpened] = useState(false);
	const [isTemplateGroupOpened, setIsTemplateGroupOpened] = useState(false);
	const [isStartRegistering, setIsStartRegistering] = useState(false);
	const [activeGroupIndex, setActiveGroupIndex] = useState(1); // ✅ Call at the top level
	const [activeIndex, setActiveIndex] = useState(0); // ✅ Call at the top level
	const [showLeftArrow, setShowLeftArrow] = useState(false); // ✅ Call at the top level
	const [showRightArrow, setShowRightArrow] = useState(false); // ✅ Call at the top level
	const undoRegistering = useUndoRegister();
	const undoRedoActions = useUndoRedoActions();

	const actualGroups = useActualGroups() ?? [];

	const selectedGroup = selectedGroupId ? actualGroups.find((group) => group.id === selectedGroupId) : null;
	const selectedStep = selectedGroupId
		? actualGroups.find((group) => group.id === selectedGroupId)?.steps.find((step) => step.id === selectedStepId)
		: null;
	const currentAttributes = selectedStep ? selectedStep.attributes : selectedGroup ? selectedGroup.attributes : [];
	const currentTemplateGroups = selectedStep
		? selectedStep.templateGroups
		: selectedGroup
			? selectedGroup.templateGroups
			: [];

	const currentItems = [...currentAttributes, ...currentTemplateGroups].sort(
		(a, b) => a.displayOrder - b.displayOrder
	);
	// const [lastSelectedItem, setLastSelectedItem] = useState<{ type: string; id: number | null }>();

	const selectedAttribute = currentAttributes
		? currentAttributes.find((attr) => attr.id === selectedAttributeId)
		: null;

	const selectedTemplateGroup = currentTemplateGroups
		? currentTemplateGroups.find((templGr) => templGr.templateGroupID === selectedTemplateGroupId)
		: null;

	const options = selectedAttribute?.options ?? [];
	const groupIndex = actualGroups && selectedGroup ? actualGroups.indexOf(selectedGroup) : 0;

	const [lastSelectedSteps, setLastSelectedSteps] = useState(Map<number, number>());

	// const handleNextGroup = () => {
	// 	if (selectedGroup) {
	// 		if (groupIndex < actualGroups.length - 1) {
	// 			const nextGroup = actualGroups[groupIndex + 1];
	// 			handleGroupSelection(nextGroup.id);
	// 		}
	// 	}
	// };

	// const handlePreviousGroup = () => {
	// 	if (selectedGroup) {
	// 		if (groupIndex > 0) {
	// 			let previousGroup = actualGroups[groupIndex - 1];
	// 			handleGroupSelection(previousGroup.id);

	// 			// Select the last step
	// 			if (previousGroup.steps.length > 0)
	// 				handleStepSelection(previousGroup.steps[previousGroup.steps.length - 1].id);
	// 		}
	// 	}
	// };

	const handleStepChange = (step: Step | null) => {
		if (step) handleStepSelection(step.id);
	};

	// const handleGroupSelection = (groupId: number | null) => {
	// 	setIsStartRegistering(undoRegistering.startRegistering());

	// 	if (groupId && selectedGroupId !== groupId && !isUndo && !isRedo) {
	// 		undoRedoActions.eraseRedoStack();
	// 		undoRedoActions.fillUndoStack({ type: 'group', id: selectedGroupId, direction: 'undo' });
	// 		undoRedoActions.fillUndoStack({ type: 'group', id: groupId, direction: 'redo' });
	// 	}

	// 	setSelectedGroupId(groupId);
	// };

	const handleStepSelection = (stepId: number | null) => {
		setIsStartRegistering(undoRegistering.startRegistering());

		if (selectedStepId !== stepId && !isUndo && !isRedo) {
			undoRedoActions.eraseRedoStack();
			undoRedoActions.fillUndoStack({ type: 'step', id: selectedStepId, direction: 'undo' });
			undoRedoActions.fillUndoStack({ type: 'step', id: stepId ?? null, direction: 'redo' });
		}

		setSelectedStepId(stepId);

		const newStepSelected = lastSelectedSteps.set(selectedGroupId!, stepId!);
		setLastSelectedSteps(newStepSelected);
	};

	const handleAttributeSelection = (attributeId: number) => {
		setIsStartRegistering(undoRegistering.startRegistering());

		if (attributeId && selectedAttributeId !== attributeId && !isUndo && !isRedo) {
			undoRedoActions.eraseRedoStack();
			undoRedoActions.fillUndoStack({ type: 'attribute', id: selectedAttributeId, direction: 'undo' });
			undoRedoActions.fillUndoStack({ type: 'attribute', id: attributeId, direction: 'redo' });
		}

		setSelectedAttributeId(attributeId);
		setLastSelectedItem({ type: 'attribute', id: attributeId });
	};

	const handleTemplateGroupSelection = (templateGroupId: number | null) => {
		setSelectedTemplateGroupId(templateGroupId);
		setLastSelectedItem({ type: 'template-group', id: templateGroupId });
		setIsTemplateGroupOpened(true);
	};

	const handleOptionSelection = (option: Option) => {
		const undo = undoRegistering.startRegistering();
		undoRedoActions.eraseRedoStack();
		undoRedoActions.fillUndoStack({
			type: 'option',
			id: options.find((opt) => opt.selected)?.id ?? null,
			direction: 'undo'
		});
		undoRedoActions.fillUndoStack({ type: 'option', id: option.id, direction: 'redo' });

		setCamera(option.attribute.cameraLocationId!);
		selectOption(option.id);
		undoRegistering.endRegistering(undo);

		try {
			if ((window as any).algho) (window as any).algho.sendUserStopForm(true);
		} catch (e) { }
	};


	// Initial template selection
	useEffect(() => {
		if (templates.length > 0 && !currentTemplate) setTemplate(templates[0].id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [templates]);

	// auto-selection if there is only 1 group
	useEffect(() => {

		if (actualGroups && actualGroups.length === 1 && actualGroups[0].id === -2) return;
		else if (actualGroups && actualGroups.length === 1 && !selectedGroupId) setSelectedGroupId(actualGroups[0].id);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [actualGroups, selectedGroupId]);

	// Reset attribute selection when group selection changes
	useEffect(() => {
		if (selectedGroup && selectedGroup.id !== -2) {
			if (selectedGroup.steps.length > 0) {

				if (lastSelectedSteps.get(selectedGroupId!))
					handleStepSelection(lastSelectedSteps.get(selectedGroupId!)!);
				else {
					handleStepSelection(selectedGroup.steps[0].id);
					if (
						selectedGroup.steps[0].attributes.length === 1 &&
						selectedGroup.steps[0].templateGroups.length === 0
					)
						handleAttributeSelection(selectedGroup.steps[0].attributes[0].id);
					else if (
						selectedGroup.steps[0].templateGroups.length === 1 &&
						selectedGroup.steps[0].attributes.length === 0
					)
						handleTemplateGroupSelection(selectedGroup.steps[0].templateGroups[0].templateGroupID);
				}
			} else {
				handleStepSelection(null);
				if (selectedGroup.attributes.length === 1 && selectedGroup.templateGroups.length === 0)
					handleAttributeSelection(selectedGroup.attributes[0].id);
				else if (selectedGroup.templateGroups.length === 1 && selectedGroup.attributes.length === 0)
					handleTemplateGroupSelection(selectedGroup.templateGroups[0].templateGroupID);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedGroup?.id]);

	useEffect(() => {
		if (selectedGroup?.id === -2) {
			setIsTemplateEditorOpened(true);
		}
	}, [selectedGroup?.id]);

	useEffect(() => {
		if (selectedGroup?.id === -3) {
			setisDesignsDraftListOpened(true);
		}
	}, [selectedGroup?.id]);

	// Camera
	useEffect(() => {
		if (!isSceneLoading && selectedGroup && selectedGroup.cameraLocationId) {
			setCamera(selectedGroup.cameraLocationId);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedGroup?.id, isSceneLoading]);

	useEffect(() => {
		if (selectedGroup && selectedGroup.steps.length > 0) {
			if (
				selectedGroup.steps.find((step) => step.id === selectedStep?.id) &&
				selectedGroup.steps.find((step) => step.id === selectedStep?.id)?.attributes.length === 1 &&
				selectedGroup.steps.find((step) => step.id === selectedStep?.id)?.templateGroups.length === 0
			)
				handleAttributeSelection(
					selectedGroup.steps!.find((step) => step.id === selectedStep?.id)!.attributes[0].id
				);
			else setSelectedAttributeId(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStep?.id]);

	useEffect(() => {
		if (isStartRegistering) {
			undoRegistering.endRegistering(false);
			setIsStartRegistering(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isStartRegistering]);

	useEffect(() => {
		if (!actualGroups || actualGroups.length === 0) return;

		// Handle single group special case
		if (actualGroups.length === 1) {
			if (actualGroups[0].id !== -2 && selectedGroupId !== actualGroups[0].id) {
				setSelectedGroupId(actualGroups[0].id);
			}
			return;
		}

		// Handle multiple groups - default to the second group and set an option
		if (!selectedGroupId && actualGroups[0]?.id) {
			setSelectedGroupId(actualGroups[1].id);
			if (actualGroups[1]?.attributes?.[0]?.options?.[1]) {
				handleOptionSelection(actualGroups[0].attributes[0].options[2]);
			}
		}

		// Default to the first group if no selection and no second group
		// if (!selectedGroupId && actualGroups[0]?.id && selectedGroupId !== actualGroups[0].id) {
		// 	setSelectedGroupId(actualGroups[0].id);
		// }
	}, [actualGroups, selectedGroupId]);

	useEffect(() => {

		// Handle multiple groups - default to the second group and set an option
		if (selectedGroupId && (selectedGroupId === actualGroups[4]?.id || selectedGroupId === actualGroups[5]?.id)) {

			if (actualGroups[0]?.attributes?.[0]) {
				handleOptionSelection(actualGroups[0].attributes[0].options[3]);
			}
		} else {
			if (actualGroups[0]?.attributes?.[0]) {
				handleOptionSelection(actualGroups[0].attributes[0].options[2]);
			}
		}

	}, [selectedGroupId]);


	const handleGroupSelection = (groupId: number | null) => {
		setIsStartRegistering(undoRegistering.startRegistering());

		if (groupId && selectedGroupId !== groupId) {
			undoRedoActions.eraseRedoStack();
			undoRedoActions.fillUndoStack({ type: 'group', id: selectedGroupId, direction: 'undo' });
			undoRedoActions.fillUndoStack({ type: 'group', id: groupId, direction: 'redo' });
		}

		setSelectedGroupId(groupId);
	};

	const handleNextGroup = () => {
		if (activeGroupIndex < actualGroups.length - 1) {
			setActiveGroupIndex(activeGroupIndex + 1);
			handleGroupSelection(actualGroups[activeGroupIndex + 1].id); // Call handleGroupSelection
		}
	};

	const handlePreviousGroup = () => {
		if (activeGroupIndex > 0) {
			setActiveGroupIndex(activeGroupIndex - 1);
			handleGroupSelection(actualGroups[activeGroupIndex - 1].id); // Call handleGroupSelection
		}
	};

	const handleScroll = () => {
		const scrollableElement = document.querySelector('.scroll-snap-x');
		if (scrollableElement) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollableElement;
			const tolerance = 2; // Small tolerance to handle rounding issues

			setShowLeftArrow(scrollLeft > tolerance);
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - tolerance);
		}
	};

	const handlePrevious = (item: any) => {
		if (activeIndex > 0) {
			const newIndex = activeIndex - 1;
			setActiveIndex(newIndex);
			handleOptionSelection(item.options[newIndex]);
		}
	};

	const handleNext = (item: any) => {
		if (activeIndex < item.options?.length - 1) {
			const newIndex = activeIndex + 1;
			setActiveIndex(newIndex);
			handleOptionSelection(item.options[newIndex]);
		}
	};

	// useEffect(() => {
	// 	const initializeCamera = () => {
	// 		// Check if groups are valid
	// 		if (!groups || groups.length === 0) {
	// 			console.warn("Groups are empty or undefined.");
	// 			return;
	// 		}

	// 		// Find the camera group
	// 		const cameraGroup = groups.find((group) => group.name === "Cams");
	// 		if (!cameraGroup || cameraGroup.attributes.length === 0) {
	// 			console.warn("Camera group or attributes are missing.");
	// 			return;
	// 		}

	// 		// Extract options and determine the default camera
	// 		const options = cameraGroup.attributes[0].options;
	// 		const defaultCamera = !isMobile
	// 			? options.find((option) => option.name === "Desktop cam")
	// 			: options.find((option) => option.name === "Mobile cam");

	// 		// console.log('dddddddddddd', defaultCamera)
	// 		if (defaultCamera) {
	// 			// setCamera(defaultCamera.attribute.cameraLocationId!);
	// 			handleOptionSelection(defaultCamera);
	// 		} else {
	// 			console.warn("No default camera found for the current device.");
	// 		}
	// 	};

	// 	// Call initialization logic
	// 	initializeCamera();
	// }, [groups]);
	console.log("Initialization", actualGroups)
	if (isSceneLoading)
		return (
			<PreviewContainer>
				<BlurOverlay>
					{/* <span>Loading scene...</span>; */}
					<ProgressBarLoadingOverlay />
				</BlurOverlay>
			</PreviewContainer>
		);



	return (
		<SelectorMobileContainer>
			{sellerSettings && sellerSettings.priceInfoText && (
				<PriceInfoTextContainer dangerouslySetInnerHTML={{ __html: sellerSettings.priceInfoText }} />
			)}


			<div className="flex justify-center w-full items-center">
				{actualGroups.length > 1 && (
					<div className="flex justify-center w-full items-center">
						{/* Previous Button */}
						<button
							onClick={handlePreviousGroup}
							disabled={activeGroupIndex === 1} // Disable if it's the first group
							className="z-10  "
						>
							{activeGroupIndex !== 1 && <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1L1 6.7037L7 12" stroke="black" stroke-linecap="round"></path><path d="M13 1.00049L7 6.70419L13 12.0005" stroke="black" stroke-width="2" stroke-linecap="round"></path></svg>}

						</button>

						{/* Active Group */}
						<div
							key={actualGroups[activeGroupIndex].guid}
							className=" py-1 px-5 flex justify-center items-center"
						>
							<button onClick={() => handleGroupSelection(actualGroups[activeGroupIndex].id)} className="text-xl font-bold text-black leading-relaxed tracking-wide">
								{actualGroups[activeGroupIndex].name
									? T._d(actualGroups[activeGroupIndex].name)
									: T._('Customize', 'Composer')}
							</button>
						</div>

						{/* Next Button */}
						<button
							onClick={handleNextGroup}
							disabled={activeGroupIndex === actualGroups.length - 1} // Disable if it's the last group
							className=" z-10"
						>
							{activeGroupIndex !== actualGroups.length - 1 &&
								<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1L13 6.7037L7 12" stroke="black" stroke-linecap="round"></path><path d="M1 1.00049L7 6.70419L1 12.0005" stroke="black" stroke-width="2" stroke-linecap="round"></path></svg>}
						</button>
					</div>
				)}
			</div>

			{selectedGroup && selectedGroup.id !== -2 && selectedGroup.steps && selectedGroup.steps.length > 0 && (
				<StepsMobileContainer>
					<Steps
						key={'steps-' + selectedGroup?.id}
						hasNextGroup={groupIndex !== actualGroups.length - 1}
						hasPreviousGroup={groupIndex !== 0}
						onNextStep={handleNextGroup}
						onPreviousStep={handlePreviousGroup}
						currentStep={selectedStep}
						steps={selectedGroup.steps}
						onStepChange={handleStepChange}
					/>
				</StepsMobileContainer>
			)}

			{/* <MobileItemsContainer2
				isLeftArrowVisible
				isRightArrowVisible
				scrollLeft={scrollLeft ?? 0}
				onScrollChange={(value) => setScrollLeft(value)}
			>
				{actualGroups.map((group) => {
					if (group)
						return (
							<MenuItem2
								key={group.guid}
								imageUrl={
									group.id === -3 ? savedCompositionsIcon : group.imageUrl ? group.imageUrl : star
								}
								label={group.name ? T._d(group.name) : T._('Customize', 'Composer')}
								onClick={() => handleGroupSelection(group.id)}
							></MenuItem2>
						);
					else return null;
				})}
			</MobileItemsContainer2> */}




			{/* <AttributesContainer > */}
			{selectedGroup && selectedGroup.id === -2 && templates.length > 1 && (
				<TemplatesContainer>
					{templates.map((template) => (
						<Template
							key={template.id}
							selected={currentTemplate === template}
							onClick={async () => {
								await setTemplate(template.id);
							}}
						>
							{T._d(template.name)}
						</Template>
					))}
				</TemplatesContainer>
			)}

			{selectedGroup && selectedGroup.name && (
				<MobileItemsContainer
					isLeftArrowVisible
					isRightArrowVisible
					scrollLeft={attributesScroll ?? 0}
					onScrollChange={(value) => setAttributesScroll(value)}
				>
					{/* Attributes */}

					{selectedGroup &&
						!selectedAttributeId &&
						!selectedTemplateGroupId &&
						currentItems &&
						currentItems.map((item) => {
							if (!(item instanceof ThemeTemplateGroup))
								return (
									<MenuItem
										selected={item.id === selectedAttributeId}
										key={item.guid}
										onClick={() => handleAttributeSelection(item.id)}
										images={item.options
											.slice(0, 4)
											.map((x) => (x.imageUrl ? x.imageUrl : noImage))}
										label={T._d(item.name)}
										isRound={item.optionShapeType === 2}
									>
										<ItemName> {T._d(item.name).toUpperCase()} </ItemName>
									</MenuItem>
								);
							else
								return (
									<MenuItem
										selected={item.templateGroupID === selectedTemplateGroupId}
										key={item.templateGroupID}
										onClick={() => handleTemplateGroupSelection(item.templateGroupID)}
										imageUrl={noImage}
										label={T._d(item.name)}
										isRound={false}
									>
										<ItemName> {T._d(item.name).toUpperCase()} </ItemName>
									</MenuItem>
								);
						})}
					{/* </CarouselContainer> */}

					{/* Options */}
					<MobileItemsContainer
						isLeftArrowVisible={options.length !== 0}
						isRightArrowVisible={options.length !== 0}
						scrollLeft={optionsScroll ?? 0}
						onScrollChange={(value) => setOptionsScroll(value)}
						justifyContent={!['SCALES', 'Milled Pocket Colors', 'HARDWARE'].includes(selectedGroup?.name)}
					>
						{lastSelectedItem?.type === 'attribute' ? (
							<>
								{selectedAttribute &&
									selectedAttribute.options.map(
										(option) =>
											option.enabled && (
												<MenuItem
													isRound={selectedAttribute.optionShapeType === 2}
													description={option.description}
													selected={option.selected}
													imageUrl={option.imageUrl ?? ''}
													label={T._d(option.name)}
													hideLabel={selectedAttribute.hideOptionsLabel}
													key={option.guid}
													onClick={() => handleOptionSelection(option)}
												/>
											)
									)}
							</>
						) : (
							selectedTemplateGroup &&
							isTemplateGroupOpened && (
								<TemplateGroup
									key={selectedTemplateGroupId}
									templateGroup={selectedTemplateGroup!}
									isMobile
									onCloseClick={() => {
										setIsTemplateGroupOpened(false);
										handleTemplateGroupSelection(null);
										handleGroupSelection(null);
									}}
								/>
							)
						)}
					</MobileItemsContainer>
				</MobileItemsContainer>
			)}




			{selectedGroup && (selectedGroup.name === "PANEL" || selectedGroup.name === "BOTTOM") && (
				<>
					{/* Attributes */}
					<>
						{selectedGroup &&
							!selectedAttribute &&
							!selectedTemplateGroupId &&
							currentItems &&
							currentItems.map((item) => {
								if (!(item instanceof ThemeTemplateGroup)) {
									return (

										<div key={item.guid} >
											{item.name === "Color Variant" ?
												<MobileItemsContainer
													isLeftArrowVisible
													isRightArrowVisible
													scrollLeft={attributesScroll ?? 0}
													onScrollChange={(value) => setAttributesScroll(value)}
												>
													<div style={{ display: 'flex', gap: '.5rem', }} className=' w-full'>
														{item.options.map((option) => {
															const optionKey = `option-${option.guid}`;
															const isSelected = option.selected; // Check if the option is selected
															return (
																<div key={option.guid}>
																	<MenuItem
																		key={optionKey}
																		isRound={item.optionShapeType === 2}
																		description={option.description}
																		selected={isSelected}
																		imageUrl={option.imageUrl ?? noImage}
																		label={T._d(option.name)}
																		onClick={() => handleOptionSelection(option)}
																		hideLabel={item.hideOptionsLabel}
																	/>
																</div>
															);
														})}
													</div>
												</MobileItemsContainer>
												:
												<div className="max-w-full  bg-white flex justify-center items-center relative">
													{/* Previous Button */}
													{showLeftArrow && (
														<button
															onClick={() => handlePrevious(item)}
															disabled={activeIndex === 0 || item.options.length <= 1}
															className={`z-10 mb-4 h-6 w-6 bg-slate-100 flex items-center justify-center rounded-full absolute left-2 ${activeIndex === 0 || item.options.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
																}`}
														>
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
														</button>
													)}

													{/* Options List */}
													<div onScroll={handleScroll} className="flex gap-4 mx-auto py-1 overflow-x-auto scroll-snap-x no-scrollbar">
														{item.options.map((option, i) => (
															<div
																key={i}
																className={`flex flex-col  justify-center cursor-pointer `}
																onClick={() => {
																	setActiveIndex(i); // Set the active index
																	handleOptionSelection(option); // Handle the option selection
																}}
																style={{
																	textAlign: 'center',
																}}
															>
																<img
																	src={option.imageUrl ?? noImage}
																	alt={option.name}
																	className={`rounded-full shadow-md ${option.selected ? 'border-[4px] border-black max-w-[55px] max-h-[55px]  min-w-[55px] min-h-[55px] ' : 'max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px] '
																		}`}
																/>
																<div className="text-xs font-medium pt-1">{option.name.slice(0, 6)}</div>
															</div>
														))}
													</div>

													{/* Next Button */}
													{showRightArrow && (
														<button
															onClick={() => handleNext(item)}
															disabled={activeIndex === item.options.length - 1 || item.options.length <= 1} // Disabled if last item or no items
															className={`z-10 mb-4 h-6 w-6 bg-slate-100 flex items-center justify-center rounded-full absolute right-2 ${activeIndex === item.options.length - 1 || item.options.length <= 1
																? 'opacity-50 cursor-not-allowed'
																: ''
																}`}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 1024 1024"
																width="40px"
																height="40px"
																fill="#000000"
															>
																<path d="M419.3 264.8l-61.8 61.8L542.9 512 357.5 697.4l61.8 61.8L666.5 512z" />
															</svg>
														</button>
													)}
												</div>
											}
										</div>

									);
								} else {
									return (
										<div key={item.templateGroupID}>
											<MenuItem
												selected={item.templateGroupID === selectedTemplateGroupId}
												onClick={() => handleTemplateGroupSelection(item.templateGroupID)}
												imageUrl={noImage}
												label={T._d(item.name)}
												isRound={false}
											>
												<ItemName>{T._d(item.name).toUpperCase()}</ItemName>
											</MenuItem>
										</div>
									);
								}
							})}

					</>
					{/* <MenuItem2
																	key={optionKey}
																	isRound={item.optionShapeType === 2}
																	description={option.description}
																	selected={isSelected}
																	imageUrl={option.imageUrl ?? noImage}
																	label={T._d(option.name)}
																	onClick={() => handleOptionSelection(option)}
																	hideLabel={item.optionShapeType === 2 ? item.hideOptionsLabel : true} /> */}

					{/* Color Variant */}
					{/* <MobileItemsContainer
						isLeftArrowVisible={true}
						isRightArrowVisible={true}
						scrollLeft={optionsScroll ?? 0}
						onScrollChange={(value) => setOptionsScroll(value)}
					>
						{lastSelectedItem?.type === 'attribute' ? (
							selectedAttribute && selectedAttribute.options.length > 0 && (
								selectedAttribute.options.map((option, index) =>
									option.enabled && (
										<MenuItem
											isRound={selectedAttribute.optionShapeType === 2}
											description={option.description}
											selected={option.selected}
											imageUrl={option.imageUrl ?? ''}
											label={T._d(option.name)}
											hideLabel={selectedAttribute.hideOptionsLabel}
											key={option.guid}
											onClick={() => handleOptionSelection(option)}
										/>
									)
								)
							)
						) : (
							selectedTemplateGroup &&
							isTemplateGroupOpened && (
								<TemplateGroup
									key={selectedTemplateGroupId}
									templateGroup={selectedTemplateGroup!}
									isMobile
									onCloseClick={() => {
										setIsTemplateGroupOpened(false);
										handleTemplateGroupSelection(null);
										handleGroupSelection(null);
									}}
								/>
							)
						)}
					</MobileItemsContainer> */}
				</>
			)}

			{/* Designer / Customizer */}
			{selectedGroup?.id === -2 && isTemplateEditorOpened && (
				<Designer
					onCloseClick={() => {
						setIsTemplateEditorOpened(false);
						handleGroupSelection(null);
					}}
				/>
			)}

			{/* Saved Compositions */}
			{draftCompositions && selectedGroup?.id === -3 && isDesignsDraftListOpened && (
				<DesignsDraftList
					onCloseClick={() => {
						setIsTemplateEditorOpened(false);
						handleGroupSelection(null);
					}}
				/>
			)}
		</SelectorMobileContainer>
	);
};

export default SelectorMobile;
