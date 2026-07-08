import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HomeIcon, HistoryIcon, PlansIcon, AnalyticsIcon } from './TabIcons';

const icons: Record<string, typeof HomeIcon> = {
  index: HomeIcon,
  history: HistoryIcon,
  plans: PlansIcon,
  analytics: AnalyticsIcon,
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Hide tab bar on profile screen
  if (state.routeNames[state.index] === "profile") return null;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 12,
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#111',
          borderRadius: 32,
          paddingHorizontal: 2,
          paddingVertical: 2,
          alignItems: 'center',
          justifyContent: 'space-around',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {state.routes.filter((r) => r.name !== "profile").map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.routes[state.index]?.key === route.key;
          const color = isFocused ? '#f97316' : 'rgba(255,255,255,0.35)';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const IconComponent = icons[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 24,
                backgroundColor: isFocused ? 'rgba(249,115,22,0.15)' : 'transparent',
                minWidth: 48,
              }}
            >
              <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                {IconComponent ? (
                  <IconComponent color={color} size={24} />
                ) : (
                  <Text style={{ fontSize: 18, color }}>?</Text>
                )}
              </View>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '700',
                  color,
                  marginTop: 2,
                  letterSpacing: 0.3,
                  textTransform: 'uppercase',
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
