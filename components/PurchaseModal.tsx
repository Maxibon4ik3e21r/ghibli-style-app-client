import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Coins } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';
import { coinPackages, useCoinStore } from '@/store/coin-store';
import { purchaseCoins } from '@/services/purchases';

interface PurchaseModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PurchaseModal({ visible, onClose }: PurchaseModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { addCoins } = useCoinStore();
  
  const handlePurchase = async (packageId: string, coins: number) => {
    try {
      setLoading(packageId);
      const success = await purchaseCoins(packageId);
      
      if (success) {
        addCoins(coins);
        onClose();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Purchase Coins</Text>
            <Text style={styles.subtitle}>1 coin = 1 Ghibli transformation</Text>
          </View>
          
          <View style={styles.packagesContainer}>
            {coinPackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={styles.packageItem}
                onPress={() => handlePurchase(pkg.id, pkg.coins)}
                disabled={loading !== null}
              >
                <View style={styles.packageInfo}>
                  <Coins size={24} color={Colors.accent} />
                  <Text style={styles.packageCoins}>{pkg.coins} coins</Text>
                </View>
                <View style={styles.packagePrice}>
                  {loading === pkg.id ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Text style={styles.priceText}>{pkg.price}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <Button
            title="Close"
            variant="secondary"
            onPress={onClose}
            disabled={loading !== null}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'center',
  },
  packagesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageCoins: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  packagePrice: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});