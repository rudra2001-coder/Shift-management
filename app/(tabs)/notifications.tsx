import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { format } from 'date-fns';
import { Bell, Clock, Info, MessageSquare } from 'lucide-react-native';
import { NotificationType } from '@/types/notification';
import { fetchUserNotifications, markNotificationAsRead } from '@/services/notificationService';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const backgroundColor = theme === 'dark' ? colors.gray[900] : colors.gray[50];
  const textColor = theme === 'dark' ? colors.white : colors.gray[900];
  const cardBgColor = theme === 'dark' ? colors.gray[800] : colors.white;
  
  useEffect(() => {
    const loadNotifications = async () => {
      if (user) {
        try {
          const fetchedNotifications = await fetchUserNotifications(user.id);
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error('Error loading notifications:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadNotifications();
  }, [user]);
  
  const handleNotificationPress = async (notification: NotificationType) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      }
      
      // Navigate based on notification type
      if (notification.type === 'shift_assigned' || notification.type === 'shift_changed') {
        router.push(`/(tabs)/calendar/shift/${notification.shiftId}`);
      } else if (notification.type === 'vacation_response') {
        router.push(`/(tabs)/calendar/vacation/${notification.requestId}`);
      } else if (notification.type === 'announcement') {
        router.push(`/(tabs)/notifications/${notification.id}`);
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'shift_assigned':
      case 'shift_changed':
        return <Clock size={20} color={colors.blue[500]} />;
      case 'vacation_response':
        return <Bell size={20} color={colors.green[500]} />;
      case 'announcement':
        return <MessageSquare size={20} color={colors.orange[500]} />;
      default:
        return <Info size={20} color={colors.gray[500]} />;
    }
  };
  
  const getNotificationTitle = (notification: NotificationType) => {
    switch (notification.type) {
      case 'shift_assigned':
        return 'New Shift Assigned';
      case 'shift_changed':
        return 'Shift Change';
      case 'vacation_response':
        return notification.data.approved ? 'Vacation Approved' : 'Vacation Denied';
      case 'announcement':
        return 'New Announcement';
      default:
        return 'Notification';
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Notifications</Text>
      </View>
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.notificationCard,
                { 
                  backgroundColor: cardBgColor,
                  borderLeftColor: !item.read ? colors.primary[500] : 'transparent',
                  borderLeftWidth: !item.read ? 3 : 0,
                }
              ]}
              onPress={() => handleNotificationPress(item)}
            >
              <View style={styles.notificationIcon}>
                {getNotificationIcon(item.type)}
              </View>
              <View style={styles.notificationContent}>
                <Text style={[
                  styles.notificationTitle,
                  { 
                    color: textColor,
                    fontFamily: !item.read ? fonts.heading : fonts.body,
                    fontWeight: !item.read ? '600' : 'normal',
                  }
                ]}>
                  {getNotificationTitle(item)}
                </Text>
                <Text 
                  style={[
                    styles.notificationText,
                    { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }
                  ]}
                  numberOfLines={2}
                >
                  {item.message}
                </Text>
                <Text 
                  style={[
                    styles.notificationTime,
                    { color: theme === 'dark' ? colors.gray[400] : colors.gray[500] }
                  ]}
                >
                  {format(new Date(item.createdAt), 'MMM d, h:mm a')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.notificationsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Bell size={64} color={theme === 'dark' ? colors.gray[700] : colors.gray[300]} />
          <Text style={[
            styles.emptyText,
            { color: theme === 'dark' ? colors.gray[400] : colors.gray[600] }
          ]}>
            No notifications yet
          </Text>
        </View>
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    padding: 16,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationText: {
    fontFamily: fonts.body,
    fontSize: 14,
    marginBottom: 8,
  },
  notificationTime: {
    fontFamily: fonts.body,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});