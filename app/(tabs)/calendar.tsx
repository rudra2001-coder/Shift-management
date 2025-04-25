import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { fetchUserShifts } from '@/services/shiftService';
import { ShiftType } from '@/types/shift';
import { Clock, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';

export default function CalendarScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [shifts, setShifts] = useState<ShiftType[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const backgroundColor = theme === 'dark' ? colors.gray[900] : colors.gray[50];
  const textColor = theme === 'dark' ? colors.white : colors.gray[900];
  const cardBgColor = theme === 'dark' ? colors.gray[800] : colors.white;
  
  useEffect(() => {
    const loadShifts = async () => {
      if (user) {
        try {
          const fetchedShifts = await fetchUserShifts(user.id);
          setShifts(fetchedShifts);
          
          // Create marked dates for calendar
          const markedDatesObject: any = {};
          fetchedShifts.forEach(shift => {
            const dateStr = format(new Date(shift.date), 'yyyy-MM-dd');
            
            let dotColor;
            switch (shift.type) {
              case 'morning':
                dotColor = colors.blue[500];
                break;
              case 'night':
                dotColor = colors.indigo[500];
                break;
              case 'homeoffice':
                dotColor = colors.green[500];
                break;
              default:
                dotColor = colors.gray[500];
            }
            
            if (markedDatesObject[dateStr]) {
              // If this date already has dots, add another one
              markedDatesObject[dateStr].dots.push({
                key: shift.id,
                color: dotColor,
              });
            } else {
              markedDatesObject[dateStr] = {
                dots: [{
                  key: shift.id,
                  color: dotColor,
                }],
              };
            }
          });
          
          // Mark selected date
          if (markedDatesObject[selectedDate]) {
            markedDatesObject[selectedDate].selected = true;
            markedDatesObject[selectedDate].selectedColor = colors.primary[200];
          } else {
            markedDatesObject[selectedDate] = {
              ...markedDatesObject[selectedDate],
              selected: true,
              selectedColor: colors.primary[200],
            };
          }
          
          setMarkedDates(markedDatesObject);
        } catch (error) {
          console.error('Error loading shifts:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadShifts();
  }, [user]);
  
  const handleDayPress = (day: DateData) => {
    // Recreate marked dates, but now with the new selected date
    let updatedMarkedDates = { ...markedDates };
    
    // Remove selected state from previously selected date
    Object.keys(updatedMarkedDates).forEach(dateStr => {
      if (updatedMarkedDates[dateStr].selected) {
        const { selected, selectedColor, ...rest } = updatedMarkedDates[dateStr];
        updatedMarkedDates[dateStr] = rest;
      }
    });
    
    // Add selected state to newly selected date
    if (updatedMarkedDates[day.dateString]) {
      updatedMarkedDates[day.dateString] = {
        ...updatedMarkedDates[day.dateString],
        selected: true,
        selectedColor: colors.primary[200],
      };
    } else {
      updatedMarkedDates[day.dateString] = {
        selected: true,
        selectedColor: colors.primary[200],
      };
    }
    
    setMarkedDates(updatedMarkedDates);
    setSelectedDate(day.dateString);
  };
  
  // Filter shifts for the selected date
  const shiftsForSelectedDate = shifts.filter(shift => 
    format(new Date(shift.date), 'yyyy-MM-dd') === selectedDate
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Shift Calendar</Text>
      </View>
      
      <RNCalendar
        markingType={'multi-dot'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        enableSwipeMonths={true}
        theme={{
          calendarBackground: theme === 'dark' ? colors.gray[800] : colors.white,
          textSectionTitleColor: theme === 'dark' ? colors.gray[300] : colors.gray[600],
          selectedDayBackgroundColor: colors.primary[600],
          selectedDayTextColor: colors.white,
          todayTextColor: colors.primary[600],
          dayTextColor: theme === 'dark' ? colors.white : colors.gray[900],
          textDisabledColor: theme === 'dark' ? colors.gray[600] : colors.gray[400],
          monthTextColor: theme === 'dark' ? colors.white : colors.gray[900],
          arrowColor: colors.primary[600],
        }}
      />
      
      <View style={styles.shiftsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.dateTitle, { color: textColor }]}>
            {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
          </Text>
          
          {user?.role === 'admin' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/(tabs)/admin/shifts/create')}
            >
              <Text style={styles.addButtonText}>+ Add Shift</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {shiftsForSelectedDate.length > 0 ? (
          <FlatList
            data={shiftsForSelectedDate}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.shiftCard, { backgroundColor: cardBgColor }]}
                onPress={() => router.push(`/(tabs)/calendar/shift/${item.id}`)}
              >
                <View 
                  style={[
                    styles.shiftIndicator, 
                    { 
                      backgroundColor: 
                        item.type === 'morning' ? colors.blue[500] : 
                        item.type === 'night' ? colors.indigo[500] : 
                        item.type === 'homeoffice' ? colors.green[500] : 
                        colors.gray[500] 
                    }
                  ]} 
                />
                <View style={styles.shiftContent}>
                  <Text style={[styles.shiftTitle, { color: textColor }]}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Shift
                  </Text>
                  
                  <View style={styles.shiftDetails}>
                    <View style={styles.detailRow}>
                      <Clock size={16} color={theme === 'dark' ? colors.gray[400] : colors.gray[500]} />
                      <Text style={[styles.detailText, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                        {item.startTime} - {item.endTime}
                      </Text>
                    </View>
                    
                    {item.location && (
                      <View style={styles.detailRow}>
                        <MapPin size={16} color={theme === 'dark' ? colors.gray[400] : colors.gray[500]} />
                        <Text style={[styles.detailText, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                          {item.location}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.shiftsList}
          />
        ) : (
          <View style={[styles.emptyState, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.emptyText, { color: theme === 'dark' ? colors.gray[400] : colors.gray[600] }]}>
              No shifts scheduled for this day
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: 'bold',
  },
  shiftsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    fontFamily: fonts.button,
    color: colors.white,
    fontSize: 14,
  },
  shiftsList: {
    paddingBottom: 16,
  },
  shiftCard: {
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  shiftIndicator: {
    width: 4,
  },
  shiftContent: {
    flex: 1,
    padding: 12,
  },
  shiftTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  shiftDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  detailText: {
    fontFamily: fonts.body,
    fontSize: 14,
    marginLeft: 6,
  },
  emptyState: {
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 16,
    textAlign: 'center',
  },
});