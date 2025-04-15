import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Share, Alert, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { Download, Share2, RefreshCw } from 'lucide-react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { usePhotoStore } from '@/store/photo-store';
import { downloadImage } from '@/services/api';
import { useCoinStore } from '@/store/coin-store';
import PurchaseModal from '@/components/PurchaseModal';

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { photos, updatePhoto } = usePhotoStore();
  const { coins, useCoins } = useCoinStore();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  // Find the photo with the given ID
  const photo = photos.find(p => p.id === id);
  
  if (!photo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>Photo not found</Text>
          <Button title="Go Back" onPress={() => router.back()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }
  
  const handleDownload = async () => {
    if (!photo.transformedUrl) {
      Alert.alert('Error', 'No transformed image available');
      return;
    }
    
    try {
      setDownloading(true);
      
      if (Platform.OS === 'web') {
        // Для веб - открываем изображение в новой вкладке
        window.open(photo.transformedUrl, '_blank');
        return;
      }
      
      const filename = `ghibli_${photo.id}.jpg`;
      const uri = await downloadImage(photo.transformedUrl, filename);
      
      if (uri) {
        Alert.alert('Success', 'Image saved to your device');
      } else {
        Alert.alert('Error', 'Failed to save image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert('Error', 'Failed to download image');
    } finally {
      setDownloading(false);
    }
  };
  
  const handleShare = async () => {
    if (!photo.transformedUrl) {
      Alert.alert('Error', 'No transformed image available');
      return;
    }
    
    try {
      setSharing(true);
      
      const result = await Share.share({
        url: photo.transformedUrl,
        title: 'Check out my Ghibli-style photo!',
        message: 'Check out my Ghibli-style photo created with Ghibli AI!',
      });
      
      if (result.action === Share.sharedAction) {
        console.log('Shared successfully');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image');
    } finally {
      setSharing(false);
    }
  };
  
  const handleRegenerate = () => {
    if (coins <= 0) {
      setShowPurchaseModal(true);
      return;
    }
    
    Alert.alert(
      'Regenerate Image',
      'This will use 1 coin to regenerate the image. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Regenerate',
          onPress: async () => {
            try {
              // Use one coin
              const success = useCoins(1);
              if (!success) {
                setShowPurchaseModal(true);
                return;
              }
              
              setRegenerating(true);
              
              // Update status to processing
              updatePhoto(photo.id, {
                status: 'processing',
                transformedUrl: undefined
              });
              
              // Navigate to editor with the original image
              router.replace({
                pathname: '/editor',
                params: { imageUri: photo.originalUrl }
              });
            } catch (error) {
              console.error('Error regenerating image:', error);
              Alert.alert('Error', 'Failed to regenerate image');
              setRegenerating(false);
            }
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            {photo.transformedUrl ? (
              <ExpoImage
                source={{ uri: photo.transformedUrl }}
                style={styles.image}
                contentFit="contain"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {photo.status === 'processing' ? 'Processing...' : 'Failed to transform'}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.actions}>
            <Button
              title="Download"
              onPress={handleDownload}
              icon={<Download size={20} color={Colors.buttonText} />}
              loading={downloading}
              disabled={downloading || sharing || regenerating || !photo.transformedUrl}
              variant="primary"
              fullWidth
            />
            
            <View style={styles.buttonSpacer} />
            
            <Button
              title="Share"
              onPress={handleShare}
              icon={<Share2 size={20} color={Colors.buttonText} />}
              loading={sharing}
              disabled={downloading || sharing || regenerating || !photo.transformedUrl}
              variant="primary"
              fullWidth
            />
            
            <View style={styles.buttonSpacer} />
            
            <Button
              title="Regenerate"
              onPress={handleRegenerate}
              icon={<RefreshCw size={20} color={Colors.buttonText} />}
              loading={regenerating}
              disabled={downloading || sharing || regenerating}
              variant="secondary"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
      
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 300,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.secondary,
  },
  actions: {
    marginTop: 16,
  },
  buttonSpacer: {
    height: 16,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 24,
  },
});