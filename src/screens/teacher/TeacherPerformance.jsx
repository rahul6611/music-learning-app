import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PerformanceCard = ({ title, value, trend, trendValue }) => (
  <View style={styles.performanceCard}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    <View style={styles.trendContainer}>
      <Icon
        name={trend === 'up' ? 'trending-up' : 'trending-down'}
        size={20}
        color={trend === 'up' ? '#4CAF50' : '#F44336'}
      />
      <Text
        style={[
          styles.trendValue,
          { color: trend === 'up' ? '#4CAF50' : '#F44336' },
        ]}>
        {trendValue}%
      </Text>
    </View>
  </View>
);

const StudentProgressItem = ({ name, progress, score }) => (
  <View style={styles.progressItem}>
    <View style={styles.progressInfo}>
      <Text style={styles.studentName}>{name}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    </View>
    <Text style={styles.progressScore}>{score}%</Text>
  </View>
);

const TeacherPerformance = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Performance Overview</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-variant" size={24} color="#6200EE" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        <PerformanceCard
          title="Average Score"
          value="85%"
          trend="up"
          trendValue="5.2"
        />
        <PerformanceCard
          title="Completion Rate"
          value="92%"
          trend="up"
          trendValue="3.1"
        />
        <PerformanceCard
          title="Active Students"
          value="38"
          trend="down"
          trendValue="2.4"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Student Progress</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <StudentProgressItem name="John Smith" progress={85} score={85} />
        <StudentProgressItem name="Emma Wilson" progress={92} score={92} />
        <StudentProgressItem name="Michael Brown" progress={78} score={78} />
        <StudentProgressItem name="Sarah Davis" progress={95} score={95} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        {['Piano Master Level 2', 'Theory Expert', 'Perfect Attendance'].map(
          (achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Icon name="trophy" size={24} color="#FFC107" />
              </View>
              <Text style={styles.achievementText}>{achievement}</Text>
              <Icon name="chevron-right" size={24} color="#757575" />
            </View>
          ),
        )}
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    marginLeft: 5,
    color: '#6200EE',
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  performanceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: Dimensions.get('window').width / 2 - 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: '#757575',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#424242',
    marginVertical: 5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    marginLeft: 5,
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressInfo: {
    flex: 1,
    marginRight: 10,
  },
  studentName: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 4,
  },
  progressScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
    width: 50,
    textAlign: 'right',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  achievementText: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
  },
});

export default TeacherPerformance; 