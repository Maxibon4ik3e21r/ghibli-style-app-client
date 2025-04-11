import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { usePhotoStore } from '@/store/photo-store';
import PhotoGrid from '@/components/PhotoGrid';
import Colors from '@/constants/colors';

export default function GalleryScreen() {
  const { photos } = usePhotoStore();
  
  return (
    <SafeAreaView style={styles.container}>
      <PhotoGrid photos={photos} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});