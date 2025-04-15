import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  Alert, 
  Platform, 
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { nanoid } from '@/utils/nanoid';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { uploadImageToFirebase, transformImage } from '@/services/api';
import { usePhotoStore } from '@/store/photo-store';
import { useCoinStore } from '@/store/coin-store';
import PurchaseModal from '@/components/PurchaseModal';
import ProgressBar from '@/components/ProgressBar';

export default function EditorScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { addPhoto, updatePhoto, getPhotoByOriginalUrl } = usePhotoStore();
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
    
    // Проверяем кэш - возможно это изображение уже было обработано
    const cachedPhoto = getPhotoByOriginalUrl(imageUri as string);
    if (cachedPhoto) {
      // Используем существующее фото вместо создания нового
      Alert.alert(
        'Image Already Processed',
        'This image has already been transformed. Would you like to view the existing result or create a new one?',
        [
          {
            text: 'View Existing',
            onPress: () => router.replace(`/photo/${cachedPhoto.id}`)
          },
          {
            text: 'Create New',
            onPress: () => processNewImage()
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
      return;
    }
    
    processNewImage();
  };
  
  const processNewImage = async () => {
    try {
      setLoading(true);
      setProgress(10); // Начало загрузки
      
      // Use one coin
      const success = useCoins(1);
      if (!success) {
        setShowPurchaseModal(true);
        setLoading(false);
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
      
      setProgress(30); // Загрузка в Firebase
      // Upload the image to Firebase Storage and get URL
      const firebaseUrl = await uploadImageToFirebase(imageUri as string);
      
      setProgress(50); // Отправка на сервер
      console.log('Sending image to transformation API with URL:', firebaseUrl);
      // Send the Firebase URL to the transformation API
      const transformedUrl = await transformImage(firebaseUrl);
      
      setProgress(90); // Получение результата
      // Update the photo with the transformed URL
      updatePhoto(photoId, {
        transformedUrl,
        status: 'completed',
      });
      
      setProgress(100); // Завершено
      // Navigate to the photo detail screen
      router.replace(`/photo/${photoId}`);
    } catch (error: any) {
      console.error('Error transforming image:', error);
      
      // Более информативные сообщения об ошибках
      if (error.message && error.message.includes('401')) {
        Alert.alert('Authentication Error', 'Failed to authenticate with the server. Check your API key.');
      } else if (error.message && error.message.includes('404')) {
        Alert.alert('API Error', 'API endpoint not found. Check your API URL configuration.');
      } else if (error.message && error.message.includes('408')) {
        Alert.alert('Timeout', 'Image processing took too long. Please try again.');
      } else if (error.message && error.message.includes('timeout')) {
        Alert.alert('Timeout', 'Request took too long. Please try again.');
      } else {
        Alert.alert('Error', `Failed to transform image: ${error.message}`);
      }
      
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            
            {loading && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {progress < 30 ? 'Preparing...' : 
                  progress < 50 ? 'Uploading image...' : 
                  progress < 90 ? 'Transforming to Ghibli style...' : 
                  'Finishing up...'}
                </Text>
                <ProgressBar progress={progress} />
              </View>
            )}
            
            <Button
              title="Generate Image"
              onPress={handleTransform}
              loading={loading}
              disabled={loading || !imageUri}
              size="large"
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
});