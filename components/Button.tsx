import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Colors from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return Colors.placeholder;
    
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'secondary':
        return Colors.card;
      case 'danger':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return Colors.secondary;
    
    switch (variant) {
      case 'primary':
        return Colors.buttonText;
      case 'secondary':
        return Colors.primary;
      case 'danger':
        return Colors.buttonText;
      default:
        return Colors.buttonText;
    }
  };
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 14,
        };
      case 'large':
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          fontSize: 16,
        };
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        getSizeStyles(),
        fullWidth && styles.fullWidth,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, { color: getTextColor(), fontSize: getSizeStyles().fontSize }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  iconContainer: {
    marginRight: 8,
  },
});