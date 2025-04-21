import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const StudentProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={28} color="#6200EE" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://via.placeholder.com/100' }}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.role}>Music Student</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>85%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Teachers</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Teachers</Text>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.teacherCard}>
            <Image
              style={styles.teacherImage}
              source={{ uri: 'https://via.placeholder.com/50' }}
            />
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>Teacher {item}</Text>
              <Text style={styles.teacherSubject}>Piano</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#757575" />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="account" size={24} color="#6200EE" />
          <Text style={styles.settingText}>Personal Information</Text>
          <Icon name="chevron-right" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="bell" size={24} color="#6200EE" />
          <Text style={styles.settingText}>Notifications</Text>
          <Icon name="chevron-right" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="shield" size={24} color="#6200EE" />
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Icon name="chevron-right" size={24} color="#757575" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameContainer: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
  },
  role: {
    fontSize: 16,
    color: '#757575',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 15,
  },
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  teacherInfo: {
    flex: 1,
    marginLeft: 15,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  teacherSubject: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default StudentProfile; 