import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, ScrollView, Linking } from 'react-native';
import { Coins, Trash2, Info, ExternalLink } from 'lucide-react-native';
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
  
  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy-policy');
  };
  
  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms-of-service');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>
              Ghibli AI transforms your photos into beautiful Ghibli-style artwork using advanced AI technology.
            </Text>
            
            <View style={styles.linkContainer}>
              <Button
                title="Privacy Policy"
                onPress={openPrivacyPolicy}
                variant="secondary"
                icon={<ExternalLink size={16} color={Colors.primary} />}
                size="small"
              />
              
              <View style={styles.linkSpacer} />
              
              <Button
                title="Terms of Service"
                onPress={openTermsOfService}
                variant="secondary"
                icon={<ExternalLink size={16} color={Colors.primary} />}
                size="small"
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            <Button
              title="Delete all photos"
              onPress={handleDeleteAllPhotos}
              variant="danger"
              icon={<Trash2 size={20} color={Colors.buttonText} />}
              fullWidth
            />
            <Text style={styles.disclaimerText}>
              This will delete all your photos from this device. Photos stored in your gallery will not be affected.
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
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
  aboutText: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  linkSpacer: {
    width: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: Colors.secondary,
  },
});