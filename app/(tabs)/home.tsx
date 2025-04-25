import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { ArrowRight, Calendar, Clock, Home as HomeIcon, Moon, Send, User2 } from 'lucide-react-native';
import { fetchUserShifts } from '@/services/shiftService';
import { ShiftType } from '@/types/shift';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [upcomingShifts, setUpcomingShifts] = useState<ShiftType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const backgroundColor = theme === 'dark' ? colors.gray[900] : colors.gray[50];
  const textColor = theme === 'dark' ? colors.white : colors.gray[900];
  const cardBgColor = theme === 'dark' ? colors.gray[800] : colors.white;
  
  useEffect(() => {
    const loadShifts = async () => {
      if (user) {
        try {
          // Get next 3 upcoming shifts
          const shifts = await fetchUserShifts(user.id, 3);
          setUpcomingShifts(shifts);
        } catch (error) {
          console.error('Error loading shifts:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadShifts();
  }, [user]);
  
  const getShiftIcon = (shiftType: string) => {
    switch(shiftType) {
      case 'morning':
        return <Calendar size={20} color={colors.blue[500]} />;
      case 'night':
        return <Moon size={20} color={colors.indigo[500]} />;
      case 'homeoffice':
        return <HomeIcon size={20} color={colors.green[500]} />;
      default:
        return <Calendar size={20} color={colors.gray[500]} />;
    }
  };
  
  const getShiftColor = (shiftType: string) => {
    switch(shiftType) {
      case 'morning':
        return colors.blue[500];
      case 'night':
        return colors.indigo[500];
      case 'homeoffice':
        return colors.green[500];
      default:
        return colors.gray[500];
    }
  };

  const getTimeString = (start: string, end: string) => {
    return `${start} - ${end}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: textColor }]}>
          Hello, {user?.displayName || 'User'}
        </Text>
        <Text style={[styles.date, { color: theme === 'dark' ? colors.gray[400] : colors.gray[600] }]}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Upcoming Shifts</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/(tabs)/calendar')}
            >
              <Text style={styles.seeAllText}>View Calendar</Text>
              <ArrowRight size={16} color={colors.primary[600]} />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ActivityIndicator style={styles.loader} size="large" color={colors.primary[500]} />
          ) : upcomingShifts.length > 0 ? (
            <View>
              {upcomingShifts.map((shift, index) => (
                <TouchableOpacity 
                  key={shift.id} 
                  style={[
                    styles.shiftCard, 
                    { backgroundColor: cardBgColor }
                  ]}
                  onPress={() => router.push(`/(tabs)/calendar/shift/${shift.id}`)}
                >
                  <View style={[styles.shiftTypeIndicator, { backgroundColor: getShiftColor(shift.type) }]} />
                  <View style={styles.shiftContent}>
                    <View style={styles.shiftHeader}>
                      <View style={styles.shiftTypeContainer}>
                        {getShiftIcon(shift.type)}
                        <Text style={styles.shiftType}>
                          {shift.type.charAt(0).toUpperCase() + shift.type.slice(1)} Shift
                        </Text>
                      </View>
                      <Text style={styles.shiftDate}>
                        {format(new Date(shift.date), 'MMM d, yyyy')}
                      </Text>
                    </View>
                    
                    <View style={styles.shiftDetails}>
                      <View style={styles.detailItem}>
                        <Clock size={16} color={theme === 'dark' ? colors.gray[400] : colors.gray[500]} />
                        <Text style={[styles.detailText, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                          {getTimeString(shift.startTime, shift.endTime)}
                        </Text>
                      </View>
                      
                      {shift.location && (
                        <View style={styles.detailItem}>
                          <HomeIcon size={16} color={theme === 'dark' ? colors.gray[400] : colors.gray[500]} />
                          <Text style={[styles.detailText, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                            {shift.location}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: cardBgColor }]}>
              <Text style={[styles.emptyStateText, { color: theme === 'dark' ? colors.gray[400] : colors.gray[600] }]}>
                No upcoming shifts scheduled
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: cardBgColor }]}
              onPress={() => router.push('/(tabs)/calendar/request-vacation')}
            >
              <Calendar size={24} color={colors.primary[500]} />
              <Text style={[styles.actionTitle, { color: textColor }]}>Request Vacation</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: cardBgColor }]}
              onPress={() => router.push('/(tabs)/notifications')}
            >
              <Send size={24} color={colors.primary[500]} />
              <Text style={[styles.actionTitle, { color: textColor }]}>Messages</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: cardBgColor }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <User2 size={24} color={colors.primary[500]} />
              <Text style={[styles.actionTitle, { color: textColor }]}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  greeting: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.primary[600],
    marginRight: 4,
  },
  loader: {
    marginVertical: 20,
  },
  shiftCard: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  shiftTypeIndicator: {
    width: 4,
    height: '100%',
  },
  shiftContent: {
    flex: 1,
    padding: 16,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftType: {
    fontFamily: fonts.heading,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.gray[800],
  },
  shiftDate: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.gray[600],
  },
  shiftDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: fonts.body,
    fontSize: 14,
    marginLeft: 8,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: fonts.body,
    fontSize: 16,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '31%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionTitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});