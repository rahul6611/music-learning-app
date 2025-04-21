import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const StudentDetail = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const studentDoc = await firestore()
          .collection('users')
          .doc(studentId)
          .get();

        if (studentDoc.exists) {
          setStudent({
            id: studentDoc.id,
            ...studentDoc.data(),
          });
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading student details...</Text>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="exclamation-circle" size={50} color="#757575" />
        <Text style={styles.errorText}>Student not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {student.photoURL ? (
            <Image source={{ uri: student.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.studentName}>{student.fullName || 'Student'}</Text>
        <Text style={styles.studentEmail}>{student.email}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="music" size={24} color="#6200EE" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="star" size={24} color="#6200EE" />
            <Text style={styles.statValue}>4.5</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="calendar" size={24} color="#6200EE" />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Months</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="envelope" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{student.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{student.phone || 'Not provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{student.location || 'Not provided'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Lessons</Text>
        {[1, 2, 3].map((item) => (
          <TouchableOpacity key={item} style={styles.lessonCard}>
            <View style={styles.lessonDate}>
              <Text style={styles.lessonDay}>15</Text>
              <Text style={styles.lessonMonth}>JUN</Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>Piano Basics</Text>
              <Text style={styles.lessonTime}>10:00 AM - 11:00 AM</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#757575" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="envelope" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Send Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Icon name="calendar-plus-o" size={20} color="#6200EE" />
          <Text style={styles.secondaryButtonText}>Schedule Lesson</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#757575',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200EE',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 5,
  },
  studentEmail: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#424242',
    marginLeft: 15,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  lessonDate: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  lessonDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  lessonMonth: {
    fontSize: 12,
    color: '#757575',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  lessonTime: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: '#6200EE',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  secondaryButtonText: {
    color: '#6200EE',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default StudentDetail; 