import { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TemporaryTokenContext } from '@/contexts/InventoryNamesContext/TemporaryTokenContext';

const BACKEND_BASE_URL = "http://165.227.213.87:8000";

export default function ItemDetailsScreen() {
  const { barcode } = useLocalSearchParams();
  const { token } = useContext(TemporaryTokenContext);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      setError('');
      setItem(null);
      console.log('--- ItemDetailsScreen Debug ---');
      console.log('Barcode param:', barcode);
      console.log('Token:', token);
      try {
        const url = `${BACKEND_BASE_URL}/items/${barcode}`;
        console.log('Fetching item:', url);
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('Fetch response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched item data:', data);
          setItem(data);
        } else {
          let err = null;
          try {
            err = await response.json();
          } catch (jsonErr) {
            console.log('Error parsing error response:', jsonErr);
          }
          console.log('Fetch error:', err);
          setError((err && err.detail) || 'Item not found.');
        }
      } catch (e) {
        console.log('Network error:', e);
        setError('Network error.');
      }
      setLoading(false);
    }
    if (barcode && token) fetchItem();
    else {
      if (!barcode) console.log('No barcode in params');
      if (!token) console.log('No token in context');
    }
  }, [barcode, token]);

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" /><Text>Loading item...</Text></View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}><Text style={{ color: 'red' }}>{error}</Text></View>
    );
  }
  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'gray' }}>No item data found for barcode: {barcode}</Text>
      </View>
    );
  }
  // MVP: Show all item fields as JSON and always show image if photo_url is a valid URL
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Item Details (MVP Raw View)</Text>
      <Text selectable style={{ fontFamily: 'monospace', fontSize: 14, marginBottom: 16 }}>{JSON.stringify(item, null, 2)}</Text>
      {item.photo_url && typeof item.photo_url === 'string' && item.photo_url.trim() !== '' ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text>Photo:</Text>
          <Image
            source={{ uri: item.photo_url.startsWith('http') ? item.photo_url : `${BACKEND_BASE_URL}${item.photo_url}` }}
            style={{ width: 200, height: 200, marginTop: 10 }}
            onError={() => console.log('Failed to load image:', item.photo_url)}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'flex-start',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontWeight: '400',
  },
});
