import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, FAB, Chip, Text, IconButton, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { getContacts, getRelationships, deleteContact, exportContacts } from '../../api';
import { useFocusEffect } from '@react-navigation/native';

const ContactListScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [exportMenuVisible, setExportMenuVisible] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchRelationships();
  }, [search, filter]);

  useFocusEffect(
    React.useCallback(() => {
      fetchContacts();
    }, [search, filter])
  );

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await getContacts({ search, relationship: filter });
      setContacts(res.data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
    setLoading(false);
  };

  const fetchRelationships = async () => {
    try {
      const res = await getRelationships();
      setRelationships(res.data);
    } catch (err) {
      console.error('Failed to load relationships:', err);
    }
  };

  const handleAddContact = () => {
    navigation.navigate('ContactForm');
  };

  const handleEditContact = (contact) => {
    navigation.navigate('ContactForm', { contact });
  };

  const handleViewContact = (contact) => {
    navigation.navigate('ContactDetails', { contact });
  };

  const handleDeleteContact = async (contact) => {
    try {
      await deleteContact(contact.id);
      fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await exportContacts(format);
      // Handle export based on platform
      console.log('Export successful:', res.data);
    } catch (err) {
      console.error('Error exporting contacts:', err);
    }
    setExportMenuVisible(false);
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => handleViewContact(item)}
    >
      <View style={styles.contactInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name ? item.name[0].toUpperCase() : '?'}
          </Text>
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactEmail}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.contactActions}>
        <Chip
          style={[
            styles.relationshipChip,
            { backgroundColor: item.relationship === 'Work' ? '#e8f5e9' : 
                             item.relationship === 'Family' ? '#f3e5f5' : '#e3f2fd' }
          ]}
        >
          {item.relationship}
        </Chip>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => handleEditContact(item)}
        />
        <IconButton
          icon="delete"
          size={20}
          onPress={() => handleDeleteContact(item)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search contacts..."
          onChangeText={setSearch}
          value={search}
          style={styles.searchBar}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Chip
              onPress={() => setMenuVisible(true)}
              style={styles.filterChip}
            >
              {filter || 'Filter'}
            </Chip>
          }
        >
          <Menu.Item
            onPress={() => {
              setFilter('');
              setMenuVisible(false);
            }}
            title="All"
          />
          {relationships.map((rel) => (
            <Menu.Item
              key={rel}
              onPress={() => {
                setFilter(rel);
                setMenuVisible(false);
              }}
              title={rel}
            />
          ))}
        </Menu>
        <Menu
          visible={exportMenuVisible}
          onDismiss={() => setExportMenuVisible(false)}
          anchor={
            <IconButton
              icon="download"
              size={24}
              onPress={() => setExportMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => handleExport('json')}
            title="Export as JSON"
          />
          <Menu.Item
            onPress={() => handleExport('csv')}
            title="Export as CSV"
          />
        </Menu>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text>No contacts found</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddContact}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e1bee7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  contactEmail: {
    fontSize: 15,
    color: '#666',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relationshipChip: {
    marginRight: 8,
    backgroundColor: '#e3f2fd',
    color: '#222',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4caf50',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactListScreen; 