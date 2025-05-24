import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContactListScreen from './screens/ContactListScreen';
import ContactDetailsScreen from './screens/ContactDetailsScreen';
import ContactFormScreen from './screens/ContactFormScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ContactList">
        <Stack.Screen name="ContactList" component={ContactListScreen} options={{ title: 'Contacts' }} />
        <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{ title: 'Contact Details' }} />
        <Stack.Screen name="ContactForm" component={ContactFormScreen} options={{ title: 'Add/Edit Contact' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 