import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { nanoid } from '@/utils/nanoid';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { uploadImage, transformImage } from '@/services/api';
import { usePhotoStore } from '@/store/photo-store';
import { useCoinStore } from '@/store/coin-store';
import PurchaseModal from '@/components/PurchaseModal';

export default function EditorScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { addPhoto, updatePhoto } = usePhotoStore();
  const { coins, useCoins } = useCoinStore();
  
  useEffect(() => {
    if (!imageUri) {
      Alert.alert('Error', 'No image selected');
      router.back();
    }
  }, [imageUri, router]);
  
  const handleTransform = async () => {
    if (coins <= 0) {
      setShowPurchaseModal(true);
      return;
    }
    
    try {
      setLoading(true);
      
      // Use one coin
      const success = useCoins(1);
      if (!success) {
        setShowPurchaseModal(true);
        return;
      }
      
      // Generate a unique ID for the photo
      const photoId = nanoid();
      
      // Add the photo to the store with processing status
      addPhoto({
        id: photoId,
        originalUrl: imageUri as string,
        createdAt: Date.now(),
        status: 'processing',
      });
      
      // Upload the image to get a URL
      const cloudUrl = await uploadImage(imageUri as string);
      
      // Send the URL to the transformation API
      const transformedUrl = await transformImage(cloudUrl);
      
      // Update the photo with the transformed URL
      updatePhoto(photoId, {
        transformedUrl,
        status: 'completed',
      });
      
      // Navigate to the photo detail screen
      router.replace(`/photo/${photoId}`);
    } catch (error) {
      console.error('Error transforming image:', error);
      Alert.alert('Error', 'Failed to transform image. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <ExpoImage
              source={{ uri: imageUri }}
              style={styles.image}
              contentFit="contain"
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>
        
        <Button
          title="Generate Image"
          onPress={handleTransform}
          loading={loading}
          disabled={loading || !imageUri}
          size="large"
          fullWidth
        />
      </View>
      
      <PurchaseModal
        visible={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: Colors.card,
  },
  placeholderImage: {
    width: '100%',
    height: '80%',
    borderRadius: 12,
    backgroundColor: Colors.card,
  },
});