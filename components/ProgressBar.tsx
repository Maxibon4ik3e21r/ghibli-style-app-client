import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
}

export default function ProgressBar({ progress, showPercentage = true }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View 
          style={[
            styles.progress, 
            { width: `${Math.min(Math.max(progress, 0), 100)}%` }
          ]} 
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(progress)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  track: {
    height: 8,
    backgroundColor: Colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  percentage: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.secondary,
    textAlign: 'right',
  },
});