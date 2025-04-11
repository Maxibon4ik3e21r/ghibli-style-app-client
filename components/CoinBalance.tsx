import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Coins } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useCoinStore } from '@/store/coin-store';

interface CoinBalanceProps {
  size?: 'small' | 'large';
}

export default function CoinBalance({ size = 'small' }: CoinBalanceProps) {
  const { coins } = useCoinStore();
  
  return (
    <View style={[styles.container, size === 'large' && styles.containerLarge]}>
      <Coins size={size === 'large' ? 24 : 18} color={Colors.accent} />
      <Text style={[styles.text, size === 'large' && styles.textLarge]}>
        {coins}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  containerLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  textLarge: {
    fontSize: 18,
    marginLeft: 8,
  },
});