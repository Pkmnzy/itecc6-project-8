import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import ContactListScreen from './src/screens/ContactListScreen';
import ContactFormScreen from './src/screens/ContactFormScreen';
import ContactDetailsScreen from './src/screens/ContactDetailsScreen';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4caf50', // web-client accent
    accent: '#90caf9',
    background: '#f7f9fa',
    surface: '#fff',
    text: '#222', // dark text
    placeholder: '#888',
    disabled: '#bbb',
  },
  fonts: {
    ...DefaultTheme.fonts,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="ContactList">
            <Stack.Screen 
              name="ContactList" 
              component={ContactListScreen}
              options={{ 
                title: 'Contact Manager',
                headerStyle: {
                  backgroundColor: '#f7f9fa',
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen 
              name="ContactForm" 
              component={ContactFormScreen}
              options={{ 
                title: 'Add/Edit Contact',
                headerStyle: {
                  backgroundColor: '#f7f9fa',
                },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen 
              name="ContactDetails" 
              component={ContactDetailsScreen}
              options={{ 
                title: 'Contact Details',
                headerStyle: {
                  backgroundColor: '#f7f9fa',
                },
                headerShadowVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 