import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ToolCard = ({ icon, title, description, color }) => (
  <TouchableOpacity style={styles.toolCard}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <Icon name={icon} size={32} color="#fff" />
    </View>
    <View style={styles.toolInfo}>
      <Text style={styles.toolTitle}>{title}</Text>
      <Text style={styles.toolDescription}>{description}</Text>
    </View>
    <Icon name="chevron-right" size={24} color="#757575" />
  </TouchableOpacity>
);

const TeacherTools = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teaching Tools</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="cog" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lesson Planning</Text>
        <ToolCard
          icon="book-music"
          title="Sheet Music Library"
          description="Access and manage your sheet music collection"
          color="#6200EE"
        />
        <ToolCard
          icon="calendar-clock"
          title="Lesson Scheduler"
          description="Plan and organize your teaching schedule"
          color="#00BCD4"
        />
        <ToolCard
          icon="playlist-music"
          title="Curriculum Builder"
          description="Create and customize lesson plans"
          color="#4CAF50"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assessment Tools</Text>
        <ToolCard
          icon="clipboard-check"
          title="Progress Tracker"
          description="Monitor student development and achievements"
          color="#FF9800"
        />
        <ToolCard
          icon="file-document-edit"
          title="Test Creator"
          description="Design custom tests and evaluations"
          color="#9C27B0"
        />
        <ToolCard
          icon="chart-bar"
          title="Performance Analytics"
          description="View detailed student performance metrics"
          color="#F44336"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication</Text>
        <ToolCard
          icon="message-text"
          title="Student Messaging"
          description="Send updates and feedback to students"
          color="#2196F3"
        />
        <ToolCard
          icon="bell-ring"
          title="Announcements"
          description="Broadcast important information"
          color="#FF5722"
        />
        <ToolCard
          icon="account-group"
          title="Parent Portal"
          description="Communicate with parents and guardians"
          color="#795548"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resources</Text>
        <ToolCard
          icon="video"
          title="Tutorial Videos"
          description="Access teaching and demonstration videos"
          color="#607D8B"
        />
        <ToolCard
          icon="metronome"
          title="Music Tools"
          description="Metronome, tuner, and other utilities"
          color="#009688"
        />
        <ToolCard
          icon="cloud-download"
          title="Resource Center"
          description="Download teaching materials and guides"
          color="#3F51B5"
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
  },
  settingsButton: {
    padding: 8,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 15,
    paddingLeft: 5,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    color: '#757575',
  },
});

export default TeacherTools; 