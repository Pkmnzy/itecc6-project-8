import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Menu } from 'react-native-paper';
import { addContact, updateContact, getRelationships } from '../../api';

const ContactFormScreen = ({ route, navigation }) => {
  const { contact } = route.params || {};
  const [name, setName] = useState(contact?.name || '');
  const [email, setEmail] = useState(contact?.email || '');
  const [phone, setPhone] = useState(contact?.phone || '');
  const [relationship, setRelationship] = useState(contact?.relationship || '');
  const [relationships, setRelationships] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRelationships();
  }, []);

  const fetchRelationships = async () => {
    try {
      const res = await getRelationships();
      setRelationships(res.data);
    } catch (err) {
      console.error('Failed to load relationships:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!relationship) newErrors.relationship = 'Relationship is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const contactData = {
      name,
      email,
      phone,
      relationship,
    };

    try {
      if (contact) {
        await updateContact(contact.id, contactData);
      } else {
        await addContact(contactData);
      }
      navigation.goBack();
    } catch (err) {
      console.error('Error saving contact:', err);
      setErrors({ submit: 'Failed to save contact' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          error={!!errors.name}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
        </HelperText>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!errors.email}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.email}>
          {errors.email}
        </HelperText>

        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.input}
              error={!!errors.relationship}
            >
              {relationship || 'Select Relationship'}
            </Button>
          }
        >
          {relationships.map((rel) => (
            <Menu.Item
              key={rel}
              onPress={() => {
                setRelationship(rel);
                setMenuVisible(false);
              }}
              title={rel}
            />
          ))}
        </Menu>
        <HelperText type="error" visible={!!errors.relationship}>
          {errors.relationship}
        </HelperText>

        <HelperText type="error" visible={!!errors.submit}>
          {errors.submit}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          {contact ? 'Update Contact' : 'Add Contact'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fa',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#4caf50',
  },
});

export default ContactFormScreen; 