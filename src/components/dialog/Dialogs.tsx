//import { T } from 'Helpers';
import React, { FunctionComponent, ReactElement, Suspense, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Atomic';
import styled from 'styled-components';
import useStore from '../../Store';
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg';

const dialogsPortal = document.getElementById('dialogs-portal')!;

export const dialogContext = React.createContext({ dialogId: '' });

export function useDialogManager() {
	const { addDialog, removeDialog } = useStore();
	//console.log(addDialog,'addDialog', removeDialog, 'removeDialog');
	
	const { dialogId } = useContext(dialogContext);
	//console.log(dialogId, 'dialogID');
	
	const showDialog = (key: string, dialog: ReactElement) => addDialog(key, dialog);
	const closeDialog = (key: string) => removeDialog(key);

	return {
		currentDialogId: dialogId,
		showDialog,
		closeDialog,
	};
}

const DialogOverlay = styled.div`
	position: fixed;
	background-color: rgba(0, 0, 0, 0.7);
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 40px;
	overflow: auto;
	z-index: 12;
	@media (max-width: 1024px) {
		padding: 20px;
	}
`;

const DialogWindowContainer = styled.div`
	padding: 20px;
	background-color: rgb(235, 237, 242);;
	border-radius: 5px;
	flex-basis: 600px;
	display: flex;
	flex-direction: column;
	position: relative;
	min-width: 0;
`;

const DialogWindowClose = styled(CloseIcon)`
	position: absolute;
	right: 10px;
	top: 10px;
	cursor: pointer;
	font-size: 20px;
	z-index: 999;
	width: 24px;
	height: 24px;

	&:hover {
		opacity: 0.5;
	}
`;

export const DialogWindow: FunctionComponent<{
	children?: React.ReactNode;
	className?: string;
	showCloseButton?: boolean;
	onClose: () => void;
}> = ({ children, className, showCloseButton = true, onClose }) => {
	return (
		<DialogWindowContainer className={className}>
			{showCloseButton && <DialogWindowClose onClick={onClose} />}
			{children}
		</DialogWindowContainer>
	);
};

// Side padding is for select outlines that must not be cropped
const DialogContent = styled.div<{ hasTitle?: boolean }>`
	overflow-y: auto;
	padding: 4px;
	flex: 1;
	min-height: 0;
	${(props) => props.hasTitle && `margin-top: 20px;`}
`;

export const DialogFooterButton = styled(Button)<{
	isMobile?: boolean;
	isFullWidth?: boolean;
	upperCase?: boolean;
	isSaveButton?: boolean;
}>`
	${(props) => !props.isSaveButton && `min-width:200px`};
	${(props) => props.isFullWidth && `width: 100%`};
	${(props) => props.upperCase && `text-transform: uppercase`};
	${(props) =>
		props.isMobile &&
		`
    flex:1;
    width:unset;
    font-size:12px;
    min-width: 100px;
    `};
`;

const DialogFooter = styled.div<{
	alignButtons?: string;
	noMarginFooterButton?: boolean;
	marginButtons?: number;
	isMobile?: boolean;
}>`
	display: flex;
	align-items: center;
	${(props) => props.alignButtons === 'left' && 'justify-content:flex-start'};
	${(props) => props.alignButtons === 'center' && 'justify-content:center'};
	${(props) => (props.alignButtons === 'right' || !props.alignButtons) && 'justify-content:flex-end'};
	padding: 20px 4px 0px 4px;

	${DialogFooterButton} + ${DialogFooterButton} {
		margin-left: ${(props) =>
			props.noMarginFooterButton ? '0' : props.marginButtons ? props.marginButtons + 'px' : '20px'};	
	}
`;

const DialogTitle = styled.h1`
	font-size: 15px;
	text-align: left;
	margin: 0;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	padding: 20px;
	width: 100%;
`;

interface DialogButton {
	label: string;
	secondary?: boolean;
	disabled?: boolean;
	onClick?: (url?: string) => void;
	isFullWidth?: boolean;
	upperCase?: boolean;
	isSaveButton?: boolean;
}

interface DialogProps {
	showCloseButton?: boolean;
	children?: React.ReactNode;
	onClose?: () => void;
	title?: string;
	windowDecorator?: React.FunctionComponent<any>;
	buttons?: DialogButton[];
	alignButtons?: string;
	marginButtons?: number;
	noMarginFooterButton?: boolean;
}


export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, ref) => {
	const Window = props.windowDecorator || DialogWindow;
	const { removeDialog, isMobile } = useStore();
	const { dialogId } = useContext(dialogContext);
	const onClose = props.onClose || (() => removeDialog(dialogId));
	//console.log(removeDialog, 'removeDialog');
	return (
		<DialogOverlay>
			{React.createElement(
				Window,
				{ onClose, showCloseButton: props.showCloseButton },
				<React.Fragment>
					{props.title && <DialogTitle>{props.title}</DialogTitle>}
					<DialogContent ref={ref} hasTitle={props.title !== undefined}>
						<Suspense fallback={'Loading...'}>{props.children}</Suspense>
					</DialogContent>

					{props.buttons && props.buttons.length > 0 && (
						<DialogFooter
							isMobile={isMobile}
							noMarginFooterButton={props.noMarginFooterButton}
							alignButtons={props.alignButtons}
							marginButtons={props.marginButtons}
						>
							{props.buttons.map((button) => {
								return (
									<DialogFooterButton
										isMobile={isMobile}
										isFullWidth={button.isFullWidth}
										upperCase={button.upperCase}
										isSaveButton={button.isSaveButton}
										key={button.label}
										disabled={button.disabled}
										primary={!button.secondary}
										onClick={() => button.onClick?.()}
									>
										{button.label}
									</DialogFooterButton>
								);
							})}
						</DialogFooter>
					)}
				</React.Fragment>,
			)}
		</DialogOverlay>
	);
});

export const DialogsRenderer: FunctionComponent<{}> = (props) => {
	const { dialogs } = useStore();

	return (
		<>
			{createPortal(
				dialogs.map((x) => (
					<dialogContext.Provider key={x.id} value={{ dialogId: x.id }}>
						{x.dialog}
					</dialogContext.Provider>
				)),
				dialogsPortal,
			)}
		</>
	);
};;

// #region Basic dialogs

export const BasicDialogWindow = styled(DialogWindow)`
	max-width: 600px;
`;

export const MessageDialog: FunctionComponent<{ message: string } & DialogProps> = ({ message, ...props }) => {
	const { closeDialog } = useDialogManager();
	const { dialogId } = useContext(dialogContext);
	
	return (
		<Dialog
			windowDecorator={BasicDialogWindow}
			alignButtons='center'
			buttons={[
				{
					label: 'OK',
					onClick: () => {
						closeDialog(dialogId);
						props.onClose?.();
					},
				},
			]}
			{...props}
		>
			<div dangerouslySetInnerHTML={{ __html: message }} />
		</Dialog>
	);
};

export const QuestionDialog: FunctionComponent<
	{
		message?: React.ReactNode;
		eventMessage?: string;
		buttonYesLabel?: string;
		buttonNoLabel?: string;
		onYesClick?: () => void;
		onNoClick?: () => void;
	} & DialogProps
> = ({ message, eventMessage, buttonYesLabel, buttonNoLabel, onYesClick, onNoClick, ...props }) => {
	const { closeDialog } = useDialogManager();
	const { dialogId } = useContext(dialogContext);

	return (
		<Dialog
			windowDecorator={BasicDialogWindow}
			buttons={[
				{ label: buttonYesLabel || 'Yes', onClick: onYesClick || (() => closeDialog(dialogId)) },
				{
					label: buttonNoLabel || 'No',
					secondary: true,
					onClick: onNoClick || (() => closeDialog(dialogId)),
				},
			]}
			{...props}
		>
			{message && <p>{message}</p>}
			{eventMessage && <div dangerouslySetInnerHTML={{ __html: eventMessage }} />}
		</Dialog>
	);
};

// #endregion
