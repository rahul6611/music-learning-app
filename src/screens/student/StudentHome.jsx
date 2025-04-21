import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StudentHome = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Learning</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assigned Lessons</Text>
        {[1, 2, 3].map((item) => (
          <TouchableOpacity key={item} style={styles.lessonCard}>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Piano Basics - Lesson {item}</Text>
              <Text style={styles.teacherName}>Teacher: John Doe</Text>
              <Text style={styles.lessonDate}>Due: March {item + 15}, 2024</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Assignments</Text>
        {[1, 2].map((item) => (
          <TouchableOpacity key={item} style={styles.assignmentCard}>
            <View style={styles.assignmentInfo}>
              <Text style={styles.assignmentTitle}>Practice Scales</Text>
              <Text style={styles.assignmentDesc}>Complete C major scale practice</Text>
              <Text style={styles.assignmentStatus}>Status: Pending</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Classes</Text>
        {[1, 2].map((item) => (
          <TouchableOpacity key={item} style={styles.classCard}>
            <View style={styles.classTime}>
              <Text style={styles.classTimeText}>10:00 AM</Text>
              <Text style={styles.classDateText}>Today</Text>
            </View>
            <View style={styles.classInfo}>
              <Text style={styles.classTitle}>Piano Class</Text>
              <Text style={styles.teacherName}>with John Doe</Text>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 15,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  teacherName: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  lessonDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  assignmentDesc: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  assignmentStatus: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 4,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  classTime: {
    marginRight: 15,
    alignItems: 'center',
  },
  classTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  classDateText: {
    fontSize: 12,
    color: '#757575',
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
});

export default StudentHome; 