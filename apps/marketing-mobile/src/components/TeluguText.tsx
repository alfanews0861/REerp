import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { TELUGU_FONT, isTelugu } from '../theme/typography';

export const TeluguText: React.FC<TextProps> = ({ style, children, ...props }) => {
  const containsTelugu = typeof children === 'string' ? isTelugu(children) : true;
  const teluguStyle: TextStyle = containsTelugu ? { fontFamily: TELUGU_FONT } : {};

  return (
    <RNText style={[teluguStyle, style]} {...props}>
      {children}
    </RNText>
  );
};
