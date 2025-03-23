import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const MapViewComponent = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state
  const [region, setRegion] = useState({
    latitude: 23.0225,   // Default to Ahmedabad (Gujarat Vidyapeeth)
    longitude: 72.5714,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);  // Start loading
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required for the app to work.');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (location) {
          setLocation(location.coords);
          setRegion({
            ...region,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          Alert.alert('Error', 'Could not fetch location. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch location: ' + error.message);
      } finally {
        setLoading(false);  // Stop loading
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      {location && (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* Crime Marker Example */}
          <Marker
            coordinate={{ latitude: 23.034, longitude: 72.561 }}
            title="High Crime Area"
            description="Stay Alert!"
            pinColor="red"
          />
          <Circle
            center={{ latitude: 23.034, longitude: 72.561 }}
            radius={500}  // 500m radius
            fillColor="rgba(255,0,0,0.3)"
            strokeColor="red"
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapViewComponent;
