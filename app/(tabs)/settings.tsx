import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import { Coins, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import { useCoinStore } from '@/store/coin-store';
import { usePhotoStore } from '@/store/photo-store';
import PurchaseModal from '@/components/PurchaseModal';

export default function SettingsScreen() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { coins } = useCoinStore();
  const { deleteAllPhotos } = usePhotoStore();
  
  const handleDeleteAllPhotos = () => {
    Alert.alert(
      'Delete All Photos',
      'Are you sure you want to delete all your Ghibli photos? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAllPhotos(),
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your current coin balance:</Text>
          <View style={styles.coinBalanceContainer}>
            <Coins size={32} color={Colors.accent} />
            <Text style={styles.coinBalance}>{coins}</Text>
          </View>
          <Text style={styles.coinInfo}>1x coin = 1 ghibli photo</Text>
          
          <Button
            title="Add coins"
            onPress={() => setShowPurchaseModal(true)}
            variant="primary"
            fullWidth
          />
        </View>
        
        <View style={styles.section}>
          <Button
            title="Delete all photos"
            onPress={handleDeleteAllPhotos}
            variant="danger"
            icon={<Trash2 size={20} color={Colors.buttonText} />}
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
    padding: 24,
  },
  section: {
    marginBottom: 32,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.primary,
  },
  coinBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  coinBalance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 16,
  },
  coinInfo: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});