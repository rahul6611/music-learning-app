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
import { fetchStudentAssignments } from '../../store/slices/assignmentSlice';
import { fetchLessons } from '../../store/slices/lessonSlice';
import { fetchTechnic } from '../../store/slices/technicSlice';

const StudentLibrary = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { assignments, loading: assignmentsLoading } = useSelector((state) => state.assignments);
  const { lessons } = useSelector((state) => state.lessons);
  const { technics } = useSelector((state) => state.technic);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadData = async () => {
    try {
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }
      await dispatch(fetchStudentAssignments(user.uid));
      await dispatch(fetchLessons(user.uid));
      await dispatch(fetchTechnic(user.uid));
    } catch (error) {
      Alert.alert('Error', 'Failed to load content: ' + error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const getAssignedContent = (contentType) => {
    return assignments
      .filter(assignment => 
        assignment.contentType === contentType && 
        assignment.status === 'pending'
      )
      .map(assignment => {
        const content = contentType === 'lesson' 
          ? lessons.find(l => l.id === assignment.contentId)
          : technics.find(t => t.id === assignment.contentId);
        return {
          ...content,
          dueDate: assignment.dueDate,
          assignmentId: assignment.id
        };
      });
  };

  const renderContentCard = (item) => (
    <TouchableOpacity key={item.id} style={styles.card}>
      <View style={styles.cardImage}>
        {item.mediaUri ? (
          <Image 
            source={{ uri: item.mediaUri }} 
            style={styles.contentImage}
            resizeMode="cover"
          />
        ) : (
          <Icon name="music" size={40} color="#757575" />
        )}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{item.difficulty || 'Content'}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.dueDateContainer}>
          <Icon name="calendar-clock" size={16} color="#757575" />
          <Text style={styles.dueDateText}>
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (assignmentsLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  const assignedLessons = getAssignedContent('lesson');
  const assignedTechnics = getAssignedContent('technic');

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

      {assignedLessons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Lessons</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {assignedLessons.map(renderContentCard)}
          </ScrollView>
        </View>
      )}

      {assignedTechnics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Techniques</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {assignedTechnics.map(renderContentCard)}
          </ScrollView>
        </View>
      )}

      {assignedLessons.length === 0 && assignedTechnics.length === 0 && (
        <View style={styles.emptyContainer}>
          <Icon name="book-open-variant" size={50} color="#757575" />
          <Text style={styles.emptyText}>No assigned content yet</Text>
        </View>
      )}
    </ScrollView>
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
    padding: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginLeft: 15,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginLeft: 15,
    width: 160,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentImage: {
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
    color: '#FFFFFF',
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
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dueDateText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
});

export default StudentLibrary; 