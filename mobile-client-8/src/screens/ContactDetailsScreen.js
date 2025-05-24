import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, IconButton, Chip } from 'react-native-paper';

const ContactDetailsScreen = ({ route, navigation }) => {
  const { contact } = route.params;

  const handleEdit = () => {
    navigation.navigate('ContactForm', { contact });
  };

  const handleDelete = async () => {
    // Show confirmation dialog
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.name}? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteContact(contact.id);
              navigation.goBack();
            } catch (err) {
              console.error('Error deleting contact:', err);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {contact.name ? contact.name[0].toUpperCase() : '?'}
              </Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{contact.name}</Text>
              <Chip
                style={[
                  styles.relationshipChip,
                  {
                    backgroundColor:
                      contact.relationship === 'Work'
                        ? '#e8f5e9'
                        : contact.relationship === 'Family'
                        ? '#f3e5f5'
                        : '#e3f2fd',
                  },
                ]}
              >
                {contact.relationship}
              </Chip>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoRow}>
              <IconButton icon="email" size={20} />
              <Text style={styles.infoText}>{contact.email}</Text>
            </View>
            {contact.phone && (
              <View style={styles.infoRow}>
                <IconButton icon="phone" size={20} />
                <Text style={styles.infoText}>{contact.phone}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleEdit}
          style={[styles.button, styles.editButton]}
          icon="pencil"
        >
          Edit Contact
        </Button>
        <Button
          mode="outlined"
          onPress={handleDelete}
          style={[styles.button, styles.deleteButton]}
          icon="delete"
          textColor="#d32f2f"
        >
          Delete Contact
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
  card: {
    margin: 16,
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e1bee7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  relationshipChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    color: '#222',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#222',
  },
  actions: {
    padding: 16,
  },
  button: {
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#4caf50',
  },
  deleteButton: {
    borderColor: '#d32f2f',
  },
});

export default ContactDetailsScreen; 