import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLessons } from '../../store/slices/lessonSlice';
import { fetchTechnic } from '../../store/slices/technicSlice';
import { useNavigation } from '@react-navigation/native';

const staticData = {
  technics: [
    {
      id: 1,
      title: 'Basic Piano Techniques',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Advanced Finger Exercises',
      difficulty: 'Advanced'
    },
    {
      id: 3,
      title: 'Hand Position Guide',
      difficulty: 'Intermediate'
    }
  ],
  compositions: [
    {
      id: 1,
      title: 'Classical Masterpieces',
      difficulty: 'Advanced'
    },
    {
      id: 2,
      title: 'Modern Piano Pieces',
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Jazz Compositions',
      difficulty: 'Advanced'
    }
  ],
  theory: [
    {
      id: 1,
      title: 'Music Theory Basics',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Chord Progressions',
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Advanced Harmony',
      difficulty: 'Advanced'
    }
  ],
  tests: [
    {
      id: 1,
      title: 'Grade 1 Exam Prep',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Theory Test Practice',
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Performance Assessment',
      difficulty: 'Advanced'
    }
  ]
};

const CategorySection = ({ title, items, onViewAll, onRefresh, navigation }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Icon name="refresh" size={20} color="#6200EE" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((item, index) => (
        <TouchableOpacity key={item.id || index} style={styles.card}>
          <View style={styles.cardImage}>
            {item.mediaUri ? (
              <Image 
                source={{ uri: item.mediaUri }} 
                style={styles.lessonImage}
                resizeMode="cover"
              />
            ) : (
              <Icon name="music" size={40} color="#757575" />
            )}
          </View>
          <View style={styles.cardContent}>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{item.difficulty || 'Lesson'}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            )}
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.favoriteButton}>
                <Icon name="heart-outline" size={20} color="#757575" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.assignButton}
                onPress={() => {
                  if (!navigation) {
                    console.error('Navigation prop is missing');
                    return;
                  }
                  navigation.navigate('AssignContent', {
                    contentId: item.id,
                    contentType: title.toLowerCase().includes('My Lessons') ? 'lesson' : 'technic',
                    contentTitle: item.title
                  });
                }}
              >
                <Icon name="account-plus" size={20} color="#6200EE" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const TeacherLibrary = () => {
  const dispatch = useDispatch();
  const { lessons, loading: lessonsLoading, error: lessonsError } = useSelector((state) => state.lessons);
  const { technics, loading: technicsLoading, error: technicsError } = useSelector((state) => state.technic);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);

  const loadLessons = async () => {
    try {
      if (!user || !user.uid) {
        console.log('No user found:', user);
        throw new Error('User not authenticated');
      }
      console.log('Fetching lessons for user:', user.uid);
      const result = await dispatch(fetchLessons(user.uid)).unwrap();
      console.log('Fetched lessons:', result);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      Alert.alert('Error', 'Failed to load lessons. Please try again.');
    }
  };

  const loadTechnics = async () => {
    try {
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }
      await dispatch(fetchTechnic(user.uid));
    } catch (error) {
      console.error('Failed to fetch techniques:', error);
      Alert.alert('Error', 'Failed to load techniques. Please try again.');
    }
  };

  useEffect(() => {
    if (!user || !user.uid) {
      Alert.alert('Error', 'User information not available. Please log in again.');
      return;
    }
    loadLessons();
    loadTechnics();
  }, [user]);

  const handleViewAll = (category) => {
    if (category === 'lessons') {
      if (!user || !user.uid) {
        Alert.alert('Error', 'Please log in to view lessons');
        return;
      }
      navigation.navigate('AllLessons');
    } else if (category === 'technics') {
      if (!user || !user.uid) {
        Alert.alert('Error', 'Please log in to view techniques');
        return;
      }
      navigation.navigate('AllTechnics');
    }
  };

  const handleRefreshCategory = (category) => {
    if (category === 'lessons') {
      loadLessons();
    } else if (category === 'technics') {
      loadTechnics();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadLessons(), loadTechnics()]);
    } finally {
      setRefreshing(false);
    }
  };

  if ((lessonsLoading || technicsLoading) && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (lessonsError || technicsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading content: {lessonsError || technicsError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#6200EE']}
          tintColor="#6200EE"
        />
      }
    >
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar}>
          <Icon name="magnify" size={24} color="#757575" />
          <Text style={styles.searchPlaceholder}>Search in library...</Text>
        </TouchableOpacity>
      </View>
      <CategorySection 
        title="My Lessons" 
        items={lessons} 
        onViewAll={() => handleViewAll('lessons')}
        onRefresh={() => handleRefreshCategory('lessons')}
        navigation={navigation}
      />
      <CategorySection 
        title="Technics" 
        items={technics} 
        onViewAll={() => handleViewAll('technics')}
        onRefresh={() => handleRefreshCategory('technics')}
        navigation={navigation}

      />
      <CategorySection 
        title="Compositions" 
        items={staticData.compositions} 
        onViewAll={() => handleViewAll('compositions')}
        onRefresh={() => handleRefreshCategory('compositions')}
        navigation={navigation}

      />
      <CategorySection 
        title="Theory" 
        items={staticData.theory} 
        onViewAll={() => handleViewAll('theory')}
        onRefresh={() => handleRefreshCategory('theory')}
        navigation={navigation}

      />
      <CategorySection 
        title="Tests" 
        items={staticData.tests} 
        onViewAll={() => handleViewAll('tests')}
        onRefresh={() => handleRefreshCategory('tests')}
        navigation={navigation}

      />
    </ScrollView>
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
    padding: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#757575',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  viewAll: {
    color: '#6200EE',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginLeft: 15,
    width: 160,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  lessonImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 10,
  },
  difficultyBadge: {
    position: 'absolute',
    top: -15,
    left: 10,
    backgroundColor: '#6200EE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 14,
    color: '#424242',
    marginTop: 15,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  favoriteButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  assignButton: {
    marginLeft: 10,
  },
});

export default TeacherLibrary; 