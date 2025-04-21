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
import { fetchLessons, deleteLesson } from '../../store/slices/lessonSlice';
import { useNavigation } from '@react-navigation/native';

const AllLessons = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { lessons, loading, error } = useSelector((state) => state.lessons);
  const { user } = useSelector((state) => state.auth);

  const loadLessons = async () => {
    try {
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }
      await dispatch(fetchLessons(user.uid)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to load lessons. Please try again.');
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadLessons();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    Alert.alert(
      'Delete Lesson',
      'Are you sure you want to delete this lesson?',
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
              await dispatch(deleteLesson(lessonId)).unwrap();
              Alert.alert('Success', 'Lesson deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete lesson');
            }
          },
        },
      ]
    );
  };

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLessonItem = ({ item }) => (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={() => navigation.navigate('CreateLesson', { lesson: item })}
    >
      <View style={styles.lessonImage}>
        {item.mediaUri ? (
          <Image source={{ uri: item.mediaUri }} style={styles.image} />
        ) : (
          <Icon name="music" size={40} color="#757575" />
        )}
      </View>
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.lessonDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <Text style={styles.lessonDate}>
          Created: {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteLesson(item.id)}
      >
        <Icon name="delete" size={24} color="#FF0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadLessons}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search lessons..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredLessons}
        renderItem={renderLessonItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6200EE']}
            tintColor="#6200EE"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="music-note" size={50} color="#757575" />
            <Text style={styles.emptyText}>No lessons found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
  },
  listContainer: {
    padding: 15,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 2,
    overflow: 'hidden',
  },
  lessonImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lessonInfo: {
    flex: 1,
    padding: 15,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 5,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  lessonDate: {
    fontSize: 12,
    color: '#9e9e9e',
  },
  deleteButton: {
    padding: 15,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
  },
});

export default AllLessons; 