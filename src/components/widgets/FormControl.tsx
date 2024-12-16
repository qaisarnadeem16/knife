import React, { FC } from "react";
import styled from "styled-components";

const FormControlLabel = styled.div`
  padding: 3px 0px;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const FormControlContainer = styled.div<{ rightComponent?: any }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-gap: 0px;
  margin-bottom: 0px;
`;

export const FormControl: FC<{
  label: string;
  rightComponent?: any;
  children?: React.ReactNode;
}> = ({ label, rightComponent, children }) => {
  return (
    <FormControlContainer>
      <FormControlLabel>
        <span>{label}</span>
        {rightComponent}
      </FormControlLabel>
      {children}
    </FormControlContainer>
  );
};
