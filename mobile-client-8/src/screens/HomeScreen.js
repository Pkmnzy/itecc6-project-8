import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    // TODO: Implement logout logic
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Home</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Welcome to your dashboard
      </Text>
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.button}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});

export default HomeScreen; 