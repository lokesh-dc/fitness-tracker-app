import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

interface IconProps {
  color: string;
  size: number;
}

export const HomeIcon = ({ color, size }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12L12 3L21 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 10V20H19V10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <Rect x="9" y="14" width="6" height="6" rx="1" stroke={color} strokeWidth="1.8"/>
  </Svg>
);

export const HistoryIcon = ({ color, size }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8"/>
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M3 4L6 7" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <Path d="M3 4V7H6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const PlansIcon = ({ color, size }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth="1.8"/>
    <Line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <Line x1="8" y1="12" x2="14" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <Line x1="8" y1="16" x2="12" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <Path d="M18 6H19C19.5523 6 20 6.44772 20 7V8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </Svg>
);

export const AnalyticsIcon = ({ color, size }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="13" width="4" height="7" rx="1" stroke={color} strokeWidth="1.8"/>
    <Rect x="10" y="9" width="4" height="11" rx="1" stroke={color} strokeWidth="1.8"/>
    <Rect x="16" y="4" width="4" height="16" rx="1" stroke={color} strokeWidth="1.8"/>
    <Path d="M4 20H20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <Circle cx="18" cy="4" r="2" fill={color}/>
  </Svg>
);

export const ProfileIcon = ({ color, size }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4.5" stroke={color} strokeWidth="1.8"/>
    <Path d="M3 21C3 16.5 6 14 12 14C18 14 21 16.5 21 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
