import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const TeacherHome = ({ navigation }) => {

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.headerTitle}>Teacher Dashboard</Text>
    </View>
    <View style={styles.quickActions}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('CreateLesson')}
      >
        <Icon name="plus" size={24} color="#6200EE" />
        <Text style={styles.actionText}>Add Lesson</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('CreateLesson')}
      >
        <Icon name="plus" size={24} color="#6200EE" />
        <Text style={styles.actionText}>Add Technics</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('AllLessons')}
      >
        <Icon name="list" size={24} color="#6200EE" />
        <Text style={styles.actionText}>All Lessons</Text>
      </TouchableOpacity> */}
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('StudentList')}
      >
        <Icon name="users" size={24} color="#6200EE" />
        <Text style={styles.actionText}>Students</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="envelope" size={24} color="#6200EE" />     
        <Text style={styles.actionText}>Messages</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upcoming Lessons</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((item) => (
          <TouchableOpacity key={item} style={styles.lessonCard}>
            <View style={styles.lessonTime}>
              <Text style={styles.lessonTimeText}>10:00 AM</Text>
              <Text style={styles.lessonDateText}>Today</Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Piano Basics</Text>
              <Text style={styles.lessonStudent}>with Teacher</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activities</Text>
      {[1, 2, 3].map((item) => (
        <TouchableOpacity key={item} style={styles.activityCard}>
          <Icon name="music-note" size={24} color="#6200EE" />
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>New Music Content Added</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#757575" />
        </TouchableOpacity>
      ))}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200EE',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 4,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    color: '#424242',
    fontSize: 12,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#424242',
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 200,
    elevation: 2,
  },
  lessonTime: {
    marginBottom: 10,
  },
  lessonTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  lessonDateText: {
    fontSize: 14,
    color: '#757575',
  },
  lessonInfo: {},
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  lessonStudent: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  activityInfo: {
    flex: 1,
    marginLeft: 15,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  activityTime: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
});

export default TeacherHome; 