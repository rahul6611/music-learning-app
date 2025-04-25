import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { assignContent } from '../../store/slices/assignmentSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchUsers } from '../../store/slices/authSlice';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AssignContent = ({ route, navigation }) => {

  console.log("route>>", route);

  
  const { contentId, contentType, contentTitle } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { allUsers } = useSelector((state) => state.auth);
   const [students, setStudents] = useState([]);



    useEffect(() => {
      fetchStudents();
    }, []);
  
  useEffect(() => {
    const fetchTeacherStudents = async () => {
      try {
        const teacherId = auth().currentUser.uid;
        const teacherDoc = await firestore()
          .collection('users')
          .doc(teacherId)
          .get();

        const teacherData = teacherDoc.data();
        const studentIds = teacherData?.students || [];
        const teacherStudents = allUsers.filter(user => 
          user.role === 'student' && studentIds.includes(user.id)
        );
        console.log("teacherStudents>>", teacherStudents);
        
        setStudents(teacherStudents);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch your students');
      }
    };
console.log("allUsers>>>", allUsers);

    if (allUsers.length > 0) {
      fetchTeacherStudents();
    }
  }, [allUsers]);

  const fetchStudents = async () => {
      setLoading(true);
      try {
        await dispatch(fetchUsers());
      } catch (error) {
        console.error('Error loading students:', error);
        Alert.alert('Error', 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssign = async () => {
    if (selectedStudents.length === 0) {
      Alert.alert('Error', 'Please select at least one student');
      return;
    }

    setLoading(true);
    try {
      for (const studentId of selectedStudents) {
        await dispatch(
          assignContent({
            teacherId: user.uid,
            studentId,
            contentId,
            contentType,
            dueDate: dueDate.toISOString(),
          })
        ).unwrap();
      }
      Alert.alert('Success', 'Content assigned successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to assign content: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assign {contentType}</Text>
        <Text style={styles.subtitle}>{contentTitle}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Due Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar" size={24} color="#6200EE" />
          <Text style={styles.dateText}>
            {dueDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Students</Text>
        {students && students.length > 0 ? (
          students.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={[
                styles.studentItem,
                selectedStudents.includes(student.id) && styles.selectedStudent,
              ]}
              onPress={() => toggleStudentSelection(student.id)}
            >
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentEmail}>{student.email}</Text>
              </View>
              {selectedStudents.includes(student.id) && (
                <Icon name="check-circle" size={24} color="#6200EE" />
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noStudentsText}>No students found</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.assignButton, loading && styles.disabledButton]}
        onPress={handleAssign}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.assignButtonText}>Assign to Selected Students</Text>
        )}
      </TouchableOpacity>
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
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 15,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#424242',
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  selectedStudent: {
    backgroundColor: '#F5F5F5',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    color: '#424242',
  },
  studentEmail: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  noStudentsText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 16,
    padding: 20,
  },
  assignButton: {
    backgroundColor: '#6200EE',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AssignContent; 