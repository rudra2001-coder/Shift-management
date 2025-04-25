import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { Calendar, Clock, Send, Users, FileText, Clock8 } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const backgroundColor = theme === 'dark' ? colors.gray[900] : colors.gray[50];
  const textColor = theme === 'dark' ? colors.white : colors.gray[900];
  const cardBgColor = theme === 'dark' ? colors.gray[800] : colors.white;
  
  // If not admin, redirect to home
  if (user?.role !== 'admin') {
    router.replace('/(tabs)/home');
    return null;
  }

  const adminFeatures = [
    {
      id: 'employees',
      title: 'Manage Employees',
      description: 'View and manage employee profiles',
      icon: <Users size={32} color={colors.blue[500]} />,
      route: '/(tabs)/admin/employees',
    },
    {
      id: 'shifts',
      title: 'Manage Shifts',
      description: 'Create and assign employee shifts',
      icon: <Clock size={32} color={colors.indigo[500]} />,
      route: '/(tabs)/admin/shifts',
    },
    {
      id: 'vacation',
      title: 'Vacation Requests',
      description: 'Approve or reject vacation requests',
      icon: <Calendar size={32} color={colors.green[500]} />,
      route: '/(tabs)/admin/vacation-requests',
    },
    {
      id: 'announcements',
      title: 'Send Announcements',
      description: 'Create company-wide announcements',
      icon: <Send size={32} color={colors.orange[500]} />,
      route: '/(tabs)/admin/announcements',
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'View shift and attendance reports',
      icon: <FileText size={32} color={colors.purple[500]} />,
      route: '/(tabs)/admin/reports',
    },
    {
      id: 'schedule',
      title: 'Weekly Schedule',
      description: 'Create and manage weekly schedules',
      icon: <Clock8 size={32} color={colors.red[500]} />,
      route: '/(tabs)/admin/schedule',
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Admin Dashboard</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.featuresGrid}>
          {adminFeatures.map(feature => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.featureCard, { backgroundColor: cardBgColor }]}
              onPress={() => router.push(feature.route)}
            >
              <View style={styles.featureIcon}>
                {feature.icon}
              </View>
              <Text style={[styles.featureTitle, { color: textColor }]}>{feature.title}</Text>
              <Text 
                style={[
                  styles.featureDescription,
                  { color: theme === 'dark' ? colors.gray[400] : colors.gray[600] }
                ]}
                numberOfLines={2}
              >
                {feature.description}
              </Text>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 8,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%', // Just under half to account for spacing
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
});