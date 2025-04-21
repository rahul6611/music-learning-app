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
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const SettingItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <Icon name={icon} size={24} color="#6200EE" />
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-right" size={24} color="#757575" />
  </TouchableOpacity>
);

const TeacherProfile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  console.log("user>>", user);
  

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
            source={user.photoURL}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.displayName || user.email}</Text>
            <Text style={styles.role}>Music Teacher</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <SettingItem
          icon="account"
          title="Personal Information"
          subtitle="Name, email, phone number"
        />
        <SettingItem
          icon="bell"
          title="Notifications"
          subtitle="Customize your alerts"
        />
        <SettingItem
          icon="shield"
          title="Privacy & Security"
          subtitle="Password, 2FA, data settings"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teaching</Text>
        <SettingItem
          icon="calendar"
          title="Schedule Settings"
          subtitle="Availability, time slots"
        />
        <SettingItem
          icon="cash"
          title="Payment Settings"
          subtitle="Rates, payment methods"
        />
        <SettingItem
          icon="book"
          title="Teaching Materials"
          subtitle="Resources, documents"
        />
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
    marginLeft: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
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
  editButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 15,
    marginLeft: 40
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    padding: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  settingContent: {
    flex: 1,
    marginLeft: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#424242',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
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

export default TeacherProfile; 