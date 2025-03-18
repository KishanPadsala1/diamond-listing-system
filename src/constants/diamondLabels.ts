import { DiamondShape, DiamondColor, DiamondClarity } from '../types';

// Helper objects to provide display labels for enum values
export const SHAPE_LABELS: Record<DiamondShape, string> = {
  [DiamondShape.ROUND]: 'Round',
  [DiamondShape.PRINCESS]: 'Princess',
  [DiamondShape.CUSHION]: 'Cushion',
  [DiamondShape.EMERALD]: 'Emerald',
  [DiamondShape.OVAL]: 'Oval',
  [DiamondShape.RADIANT]: 'Radiant',
  [DiamondShape.PEAR]: 'Pear',
  [DiamondShape.HEART]: 'Heart',
  [DiamondShape.MARQUISE]: 'Marquise',
  [DiamondShape.ASSCHER]: 'Asscher',
};

export const COLOR_LABELS: Record<DiamondColor, string> = {
  [DiamondColor.D]: 'D (Colorless - Highest)',
  [DiamondColor.E]: 'E (Colorless)',
  [DiamondColor.F]: 'F (Colorless)',
  [DiamondColor.G]: 'G (Near Colorless)',
  [DiamondColor.H]: 'H (Near Colorless)',
  [DiamondColor.I]: 'I (Near Colorless)',
  [DiamondColor.J]: 'J (Near Colorless)',
  [DiamondColor.K]: 'K (Faint Yellow)',
  [DiamondColor.L]: 'L (Faint Yellow)',
  [DiamondColor.M]: 'M (Faint Yellow)',
};

export const CLARITY_LABELS: Record<DiamondClarity, string> = {
  [DiamondClarity.FL]: 'FL (Flawless - Highest)',
  [DiamondClarity.IF]: 'IF (Internally Flawless)',
  [DiamondClarity.VVS1]: 'VVS1 (Very Very Slightly Included 1)',
  [DiamondClarity.VVS2]: 'VVS2 (Very Very Slightly Included 2)',
  [DiamondClarity.VS1]: 'VS1 (Very Slightly Included 1)',
  [DiamondClarity.VS2]: 'VS2 (Very Slightly Included 2)',
  [DiamondClarity.SI1]: 'SI1 (Slightly Included 1)',
  [DiamondClarity.SI2]: 'SI2 (Slightly Included 2)',
  [DiamondClarity.I1]: 'I1 (Included 1)',
  [DiamondClarity.I2]: 'I2 (Included 2)',
  [DiamondClarity.I3]: 'I3 (Included 3)',
};

// Helper functions to generate filter options from enums
export const getShapeFilters = () => 
  Object.values(DiamondShape).map(value => ({ text: value, value }));

export const getColorFilters = () => 
  Object.values(DiamondColor).map(value => ({ text: value, value }));

export const getClarityFilters = () => 
  Object.values(DiamondClarity).map(value => ({ text: value, value })); 