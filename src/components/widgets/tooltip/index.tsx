// import React, { FC, useRef } from 'react';
// import styled from 'styled-components/macro';
// import info from '../../../assets/icons/info-circle-solid.svg';
// import useDropdown from '../../../hooks/useDropdown';

// interface TooltipProps {
// 	optionDescription?: string;
// 	isMobile?: boolean;
// }

// const TooltipContainer = styled.div`
// 	position: absolute;
// 	right: 5px;
// 	top: 5px;
// 	z-index: 3;
// 	text-align: center;
// `;

// const InfoIcon = styled.img<{ isMobile?: boolean }>`
// 	height: 22px;
// 	width: 22px;
// `;

// const OptionTooltipContent = styled(TooltipContainer)`
// 	max-width: 120px;
// `;

// const Tooltip: FC<TooltipProps> = ({ optionDescription: text, isMobile }) => {
// 	const [open, close, isOpened, Dropdown] = useDropdown();
// 	const ref = useRef<HTMLImageElement>(null);

// 	return (
// 		<TooltipContainer>
// 			{isMobile ? (
// 				<InfoIcon
// 					ref={ref}
// 					isMobile={isMobile}
// 					onClick={() => open(ref.current!, 'top', 'left', true)}
// 					src={info}
// 				/>
// 			) : (
// 				<InfoIcon
// 					ref={ref}
// 					isMobile={isMobile}
// 					onMouseEnter={() => open(ref.current!, 'top', 'left', true)}
// 					onMouseLeave={() => close()}
// 					src={info}
// 				/>
// 			)}
// 			{isOpened && (
// 				<Dropdown>
// 					<OptionTooltipContent>{text}</OptionTooltipContent>
// 				</Dropdown>
// 			)}
// 		</TooltipContainer>
// 	);
// };

// export default Tooltip;
