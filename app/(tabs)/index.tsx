import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { pickImage } from '@/services/api';
import CoinBalance from '@/components/CoinBalance';
import { useCoinStore } from '@/store/coin-store';
import PurchaseModal from '@/components/PurchaseModal';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { coins } = useCoinStore();
  
  const handleImagePick = async (source: 'camera' | 'gallery') => {
    try {
      setLoading(true);
      const imageUri = await pickImage(source);
      
      if (imageUri) {
        if (coins <= 0) {
          // Show purchase modal if user has no coins
          setShowPurchaseModal(true);
        } else {
          // Navigate to editor with the selected image
          router.push({
            pathname: '/editor',
            params: { imageUri }
          });
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Make a new Ghibli photo!</Text>
        
        <View style={styles.buttonsContainer}>
          <Button
            title="Camera"
            onPress={() => handleImagePick('camera')}
            icon={<Camera size={20} color={Colors.buttonText} />}
            loading={loading}
            disabled={loading}
            fullWidth
          />
          
          <View style={styles.buttonSpacer} />
          
          <Button
            title="Gallery"
            onPress={() => handleImagePick('gallery')}
            icon={<ImageIcon size={20} color={Colors.buttonText} />}
            loading={loading}
            disabled={loading}
            fullWidth
          />
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: Colors.primary,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacer: {
    height: 16,
  },
});