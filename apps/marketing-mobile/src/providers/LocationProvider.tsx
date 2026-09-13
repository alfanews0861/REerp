import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';

interface LocationContextData {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  requestPermission: () => Promise<void>;
}

const LocationContext = createContext<LocationContextData>({
  location: null,
  errorMsg: null,
  requestPermission: async () => {},
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const hasServices = await Location.hasServicesEnabledAsync();
      if (!hasServices) {
        setErrorMsg('Location services (GPS) are disabled on this device.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
      setErrorMsg(null);
    } catch (err: any) {
      console.warn('LocationProvider error:', err);
      setErrorMsg(err?.message || 'Failed to get location');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      requestPermission().catch((err) => {
        console.warn('Initial LocationProvider request notice:', err);
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LocationContext.Provider value={{ location, errorMsg, requestPermission }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
