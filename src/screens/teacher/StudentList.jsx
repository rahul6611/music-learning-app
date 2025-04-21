import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchUsers } from '../../store/slices/authSlice';
import { addStudent, removeStudent } from '../../store/slices/teacherSlice';
import auth from '@react-native-firebase/auth';

const StudentList = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const { allUsers } = useSelector((state) => state.auth);
  const { myStudents } = useSelector((state) => state.teacher);
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
   const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

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
        
        setStudents(teacherStudents);
      } catch (error) {
        console.error('Error fetching teacher students:', error);
        Alert.alert('Error', 'Failed to fetch your students');
      }
    };

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

  const handleAddStudent = (studentId) => {
    dispatch(addStudent(studentId));
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      setLoading(true);
      
      dispatch(removeStudent(studentId));
      
      const teacherId = auth().currentUser.uid;
      await firestore().collection('users').doc(teacherId).update({
        students: firestore.FieldValue.arrayRemove(studentId),
        updatedAt: firestore.FieldValue.serverTimestamp()
      });

      await dispatch(fetchUsers());
      
      const teacherDoc = await firestore()
        .collection('users')
        .doc(teacherId)
        .get();

      const teacherData = teacherDoc.data();
      const studentIds = teacherData?.students || [];

      const updatedStudents = allUsers.filter(user => 
        user.role === 'student' && studentIds.includes(user.id)
      );
      setStudents(updatedStudents);
      
      Alert.alert('Success', 'Student removed successfully');
    } catch (error) {
      console.error('Error removing student:', error);
      Alert.alert('Error', `Failed to remove student: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudentByEmail = async () => {
    if (!studentEmail) {
      Alert.alert('Error', 'Please enter student email');
      return;
    }

    try {
      setLoading(true);
      
      const studentQuery = await firestore()
        .collection('users')
        .where('email', '==', studentEmail)
        .where('role', '==', 'student')
        .get();

      let studentId;
      
      if (studentQuery.empty) {
        studentId = firestore().collection('users').doc().id;
        
        await firestore().collection('users').doc(studentId).set({
          email: studentEmail,
          role: 'student',
          fullName: studentEmail.split('@')[0],
          createdAt: firestore.FieldValue.serverTimestamp()
        });

        Alert.alert('Success', 'New student added to the system');
      } else {
        studentId = studentQuery.docs[0].id;
      }

      if (myStudents.includes(studentId)) {
        Alert.alert('Error', 'This student is already added to your list');
        return;
      }
      
      dispatch(addStudent(studentId));
      
      const teacherId = auth().currentUser.uid;
      await firestore().collection('users').doc(teacherId).update({
        students: firestore.FieldValue.arrayUnion(studentId),
        updatedAt: firestore.FieldValue.serverTimestamp()
      });

      await dispatch(fetchUsers());
      
      const teacherDoc = await firestore()
        .collection('users')
        .doc(teacherId)
        .get();

      const teacherData = teacherDoc.data();
      const studentIds = teacherData?.students || [];

      const updatedStudents = allUsers.filter(user => 
        user.role === 'student' && studentIds.includes(user.id)
      );
      setStudents(updatedStudents);
      
      setOpenStudentModal(false);
      setStudentEmail('');
      Alert.alert('Success', 'Student added successfully');
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', `Failed to add student: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStudentItem = ({ item }) => {
    const isAdded = myStudents.includes(item.id);

    return (
      <TouchableOpacity 
        style={styles.studentCard}
        onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
      >
        <View style={styles.studentAvatar}>
          {item.photoURL ? (
            <Image source={{ uri: item.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {item.fullName ? item.fullName.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.fullName || 'Student'}</Text>
          <Text style={styles.studentEmail}>{item.email}</Text>
          <View style={styles.studentStats}>
            <View style={styles.statItem}>
              <Icon name="music" size={14} color="#6200EE" />
              <Text style={styles.statText}>5 Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="star" size={14} color="#6200EE" />
              <Text style={styles.statText}>4.5 Rating</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, isAdded && styles.addedButton]}
          onPress={() => handleRemoveStudent(item.id)}
        >
          <Icon name="minus" size={16} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    fetchStudents();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Students</Text>
          <Text style={styles.headerSubtitle}>{students.length} registered students</Text>
        </View>
        <TouchableOpacity 
          style={styles.addStudentButton}
          onPress={() => setOpenStudentModal(true)}
        >
          <Icon name="plus" size={16} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#757575" style={styles.searchIcon} />
         <TextInput
                  style={styles.searchInput}
                  placeholder="Search students..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
      </View>
      
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          renderItem={renderStudentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={onRefresh}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="users" size={50} color="#757575" />
          <Text style={styles.emptyText}>No students added yet</Text>
          <Text style={styles.emptySubText}>Add students using the + button above</Text>
        </View>
      )}

      <Modal
        visible={openStudentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenStudentModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Student</Text>
              <TouchableOpacity onPress={() => setOpenStudentModal(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#6200EE" style={styles.emailIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter student email"
                placeholderTextColor="#999"
                value={studentEmail}
                onChangeText={setStudentEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setOpenStudentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addModalButton}
                onPress={handleAddStudentByEmail}
              >
                <Text style={styles.addModalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200EE',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    padding:8,
    borderRadius: 15,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: '#757575',
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  studentAvatar: {
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  studentEmail: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  studentStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
    textAlign: 'center',
    opacity: 0.8
  },
  addButton: {
    backgroundColor: '#6200EE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft : 5
  },
  addedButton: {
    backgroundColor: '#4CAF50',
  },
  addStudentButton: {
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft : 5
  },
  addStudentButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: '#6200EE',
    fontWeight: '500',
  },
  closeButton: {
    fontSize: 20,
    color: '#000',
    opacity: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  emailIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 20,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  addModalButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
  },
});

export default StudentList; 