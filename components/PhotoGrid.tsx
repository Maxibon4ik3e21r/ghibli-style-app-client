import React from 'react';
import { View, StyleSheet, Pressable, Text, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Photo } from '@/types';
import Colors from '@/constants/colors';
import { Image as ExpoImage } from 'expo-image';
import { Loader } from 'lucide-react-native';

interface PhotoGridProps {
  photos: Photo[];
  emptyMessage?: string;
}

const { width } = Dimensions.get('window');
const numColumns = 2;
const tileSize = (width - 48) / numColumns;

export default function PhotoGrid({ photos, emptyMessage = "Here will appear your ghibli photos" }: PhotoGridProps) {
  const router = useRouter();
  
  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.placeholderGrid}>
          <View style={styles.placeholderTile} />
          <View style={styles.placeholderTile} />
          <View style={styles.placeholderTile} />
          <View style={styles.placeholderTile} />
        </View>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {photos.map((photo) => (
        <Pressable
          key={photo.id}
          style={styles.tile}
          onPress={() => router.push(`/photo/${photo.id}`)}
        >
          {photo.status === 'processing' ? (
            <View style={styles.processingContainer}>
              <Loader size={24} color={Colors.primary} />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          ) : photo.transformedUrl ? (
            <ExpoImage
              source={{ uri: photo.transformedUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed</Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  tile: {
    width: tileSize,
    height: tileSize,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  processingText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
  },
  placeholderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 300,
  },
  placeholderTile: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
});