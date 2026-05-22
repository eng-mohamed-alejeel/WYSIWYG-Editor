import { ComponentId } from '@wysiwyg/core';

export interface PropertyInspectorProps {
  componentId: ComponentId | null;
}

export type StyleValue = string | number;

export interface ComponentStyles {
  width?: StyleValue;
  height?: StyleValue;
  padding?: StyleValue;
  margin?: StyleValue;
  fontSize?: StyleValue;
  fontWeight?: StyleValue;
  textAlign?: StyleValue;
  lineHeight?: StyleValue;
  backgroundColor?: StyleValue;
  color?: StyleValue;
  borderColor?: StyleValue;
  borderWidth?: StyleValue;
  borderRadius?: StyleValue;
  borderStyle?: StyleValue;
  opacity?: StyleValue;
  boxShadow?: StyleValue;
  display?: StyleValue;
  position?: StyleValue;
}
