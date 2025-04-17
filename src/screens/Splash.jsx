import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function Splash({ navigation }) {
  const { colors } = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login'); 
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={styles.icon}>🎵</Text>
      <Text style={styles.text}>Music Learning App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 72,
    marginBottom: 20,
    color: '#fff',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
