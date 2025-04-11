import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Share, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { Download, Share2 } from 'lucide-react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { usePhotoStore } from '@/store/photo-store';
import { downloadImage } from '@/services/api';

export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { photos } = usePhotoStore();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  
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
        Alert.alert('Not Available', 'Download is not available on web');
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
  
  return (
    <SafeAreaView style={styles.container}>
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
            disabled={downloading || sharing || !photo.transformedUrl}
            variant="primary"
            fullWidth
          />
          
          <View style={styles.buttonSpacer} />
          
          <Button
            title="Share"
            onPress={handleShare}
            icon={<Share2 size={20} color={Colors.buttonText} />}
            loading={sharing}
            disabled={downloading || sharing || !photo.transformedUrl}
            variant="primary"
            fullWidth
          />
        </View>
      </View>
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