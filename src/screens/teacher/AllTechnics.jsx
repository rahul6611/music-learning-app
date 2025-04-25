import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTechnic, deleteTechnic } from '../../store/slices/technicSlice';
import { useNavigation } from '@react-navigation/native';

const AllTechnics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { technics, loading, error } = useSelector((state) => state.technic);
  const { user } = useSelector((state) => state.auth);

  const loadTechnics = async () => {
    try {
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }
      await dispatch(fetchTechnic(user.uid));
    } catch (error) {
      Alert.alert('Error', 'Failed to load techniques. Please try again.');
    }
  };

  useEffect(() => {
    loadTechnics();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTechnics();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteTechnic = async (technicId) => {
    Alert.alert(
      'Delete Technique',
      'Are you sure you want to delete this technique?',
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
              await dispatch(deleteTechnic(technicId)).unwrap();
              Alert.alert('Success', 'Technique deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete technique');
            }
          },
        },
      ]
    );
  };

  const filteredTechnics = technics.filter(technic =>
    technic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    technic.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTechnicItem = ({ item }) => (
    <TouchableOpacity
      style={styles.technicCard}
      onPress={() => navigation.navigate('CreateTechnic', { technic: item })}
    >
      <View style={styles.technicImage}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <Icon name="music" size={40} color="#757575" />
        )}
      </View>
      <View style={styles.technicInfo}>
        <Text style={styles.technicTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.technicDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.difficulty && (
          <Text style={styles.technicDifficulty}>
            Difficulty: {item.difficulty}
          </Text>
        )}
        <Text style={styles.technicDate}>
          Created: {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTechnic(item.id)}
      >
        <Icon name="delete" size={24} color="#FF0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#6200EE" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search techniques..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredTechnics}
        renderItem={renderTechnicItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateTechnic')}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    padding: 10,
  },
  technicCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  technicImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  technicInfo: {
    flex: 1,
  },
  technicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  technicDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  technicDifficulty: {
    fontSize: 14,
    color: '#6200EE',
    marginBottom: 5,
  },
  technicDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  deleteButton: {
    padding: 5,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default AllTechnics; 