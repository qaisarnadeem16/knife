import React, { FC, useCallback } from "react";
import styled from "styled-components/macro";
import { FontFamily, useZakeke } from 'zakeke-configurator-react';
import { Button, Columns, Icon, TextArea } from '../Atomic';
//import { T } from '../../Helpers';
import Select, { components, GroupBase, OptionProps, SingleValueProps } from 'react-select';
import { useState } from "react";
import { debounce } from 'lodash';

import type { PropChangeHandler } from "../layouts/Designer";

import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg'
import { FormControl } from "./FormControl";
import ColorPicker from "./colorpicker";

export interface EditTextItem {
    guid: string,
    name: string,
    text: string,
    fillColor: string,
    fontFamily: string,
    fontWeight: string,
    fontSize: number,
    isTextOnPath: boolean;
    constraints: { [key: string]: any } | null,
}

const defaultColorsPalette = ['#000000', '#FFFFFF'];

enum ItemType {
    Text = 0,
    Image = 1
}

export interface TextItem {
    type: ItemType;
    areaId: number;
    guid: string;
    name: string;
    text: string;
    strokeColor: string;
    strokeWidth: number;
    fillColor: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string | undefined;
    fontStretch: string;
    justification: string;
    isTextOnPath: boolean;
    constraints: ({
        [key: string]: any;
    }) | null;
}

const ItemTextContainer = styled.div`
`;

const TextToolsContainer = styled.div`
  display:flex;
  flex-direction:row;
  grid-gap:10px;  
  flex-wrap:wrap;
`;

const TextButtonsContainer = styled.div`
    width:50%;
    display: grid;
    grid-template-columns:1fr 1fr;
    grid-gap:5px;
`;

const ColorPickerContainer = styled.div`
  margin-right:5px;
  width: calc(100% - 30px);
  pointer: cursor;
`;

const ColorsContainer = styled.div`
  display:flex;
  flex-direction:row;
  padding-bottom: 20px;
  border-bottom: 1px #ccc dotted;  
`;

const SinglePaletteItem = styled.div<{ color: string, selected: boolean }>`
    width: 20px;
    height: 20px;
    background-color: ${props => props.color};
    border: 1px lightgray solid;
    cursor:pointer;
    
    ${props => props.selected && `border: 1px black solid;`}

    &:hover {
        opacity: 0.6;
    }
`;

const TextColorsContainer = styled.div<{ isDefaultPalette?: boolean }>`
    display: grid;
    ${props => !props.isDefaultPalette && `
    grid-template-columns: repeat(auto-fill,minmax(20px,1fr));
    grid-gap: 5px;`};
    /* grid-template-columns: repeat(auto-fill,minmax(20px,1fr)); */
    width: 100%;
`;

const OptionContainer = styled(components.Option)`
    background-color: white !important;
    
    &:hover {
        background-color: #DDD !important;
    }

    img {
        max-width: 100%;
        height: 24px;
        object-fit: contain;
    }
`;

const SingleValueContainer = styled(components.SingleValue)`
    img {
        max-width: 100%;
        height: 24px;
        object-fit: contain;
    }
`;

const FontOption = (props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>) => {
    return (
        <OptionContainer {...props}>
            {<img src={props.data.imageUrl} alt={props.data.name} />}
        </OptionContainer>
    );
}

const FontSingleValue = (props: JSX.IntrinsicAttributes & SingleValueProps<any, boolean, GroupBase<any>>) => {
    return (
        <SingleValueContainer {...props}>
            {<img src={props.data.imageUrl} alt={props.data.name} />}
        </SingleValueContainer>
    );
}

const ItemText: FC<{ item: EditTextItem, handleItemPropChange: PropChangeHandler, fonts?: FontFamily[], hideRemoveButton?: boolean }> = ({ item, handleItemPropChange, hideRemoveButton }) => {
    const { removeItem, fonts, disableTextColors, textColors } = useZakeke();

    const constraints = item.constraints;
    const canEdit = constraints?.canEdit ?? true;
    const hasCurvedText = item.isTextOnPath;
    const isUpperCase = constraints?.toUppercase ?? false;

    // Used for performance cache
    const [fillColor, setFillColor] = useState(item.fillColor);

    const weightData = typeof item.fontWeight === 'number' ? ['normal', 'normal'] : item.fontWeight.split(' ');
    const isBold = weightData.length > 1 ? weightData[1] === 'bold' : weightData[0] === 'bold';
    const isItalic = weightData.length > 1 ? weightData[0] === 'italic' : false;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (handleItemPropChange)
            handleItemPropChange((item as TextItem), 'text', (isUpperCase ? (e.currentTarget.value).toUpperCase() : e.currentTarget.value));
    }

    //eslint-disable-next-line
    const handleFillColorChange = useCallback(debounce((color: string) => {
        handleItemPropChange(item, 'font-color', color);
    }, 500), []);

    if (item)
        return <ItemTextContainer>
            <FormControl
                label={item.name} //|| T._("Text", "Composer")
                rightComponent={!hideRemoveButton && item.constraints!.canDelete && <Icon onClick={() => removeItem(item.guid)}><CloseIcon /></Icon>}>

                <TextArea
                    placeholder="Input your text here" 
                    value={isUpperCase ? item.text.toUpperCase() : item.text}
                    onChange={handleChange}
                    maxLength={!item.constraints ? null : (item.constraints.maxNrChars || null)}
                    disabled={!canEdit} />
            </FormControl>

            <TextToolsContainer>
                {(!constraints || constraints.canChangeFontFamily) && <FormControl label="Font">
                    <Select
                        styles={{
                            container: base => ({
                                ...base,
                                minWidth: 200,
                            })
                        }}
                        isSearchable={false}
                        options={fonts}
                        menuPosition="fixed"
                        components={{
                            Option: FontOption,
                            SingleValue: FontSingleValue
                        }}
                        value={[fonts!.find(x => x.name === item.fontFamily)]}
                        onChange={(font: any) => handleItemPropChange(item, 'font-family', font.name)}
                    />
                </FormControl>}
                <TextButtonsContainer>                    
                    
                </TextButtonsContainer>
            </TextToolsContainer>

            {(!disableTextColors || !(disableTextColors && textColors.length === 1)) && 
            !!item.constraints?.canChangeFontColor && (
            <FormControl label="Color">
                <ColorsContainer>
                    {!disableTextColors && <ColorPickerContainer>
                        <ColorPicker
                            color={fillColor}
                            onChange={color => {
                                handleFillColorChange(color);
                                setFillColor(color);
                            }} />
                    </ColorPickerContainer>}

                    {!disableTextColors && <TextColorsContainer isDefaultPalette>
                        {(defaultColorsPalette).map(hex => <SinglePaletteItem
                            key={hex}
                            onClick={() => {
                                handleItemPropChange(item, 'font-color', hex);
                                setFillColor(hex);
                            }}
                            selected={hex === fillColor}
                            color={hex}
                        />)}
                    </TextColorsContainer>}

                    {disableTextColors && <TextColorsContainer>
                        {textColors.map(textColor => <SinglePaletteItem
                            key={textColor.colorCode}
                            onClick={() => {
                                handleItemPropChange(item, 'font-color', textColor.colorCode)
                                setFillColor(textColor.colorCode);
                            }}
                            selected={textColor.colorCode === fillColor}
                            color={textColor.colorCode}
                        />)}
                    </TextColorsContainer>}
                </ColorsContainer>
            </FormControl>
            )}

        </ItemTextContainer >
    else
        return null;
}

export default ItemText;