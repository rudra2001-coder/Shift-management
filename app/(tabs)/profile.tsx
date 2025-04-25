import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { updateUserProfile } from '@/services/userService';
import { ChevronRight, LogOut, Mail, Moon, Phone, User as UserIcon } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const backgroundColor = theme === 'dark' ? colors.gray[900] : colors.gray[50];
  const textColor = theme === 'dark' ? colors.white : colors.gray[900];
  const cardBgColor = theme === 'dark' ? colors.gray[800] : colors.white;
  const inputBgColor = theme === 'dark' ? colors.gray[700] : colors.white;
  
  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUserProfile(user.id, {
        displayName: name,
        phone: phone,
      });
      
      setEditing(false);
      Alert.alert('Success', 'Your profile has been updated');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>My Profile</Text>
          
          {!editing && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={[styles.profileCard, { backgroundColor: cardBgColor }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary[500] }]}>
              <Text style={styles.avatarText}>
                {user?.displayName ? user.displayName.substring(0, 1).toUpperCase() : 'U'}
              </Text>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: textColor }]}>
                {user?.displayName || 'User'}
              </Text>
              <Text style={[styles.userRole, { color: theme === 'dark' ? colors.gray[400] : colors.gray[600] }]}>
                {user?.role === 'admin' ? 'Administrator' : 'Employee'}
              </Text>
            </View>
          </View>
          
          {editing ? (
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                  Full Name
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: inputBgColor }]}>
                  <UserIcon size={20} color={colors.gray[500]} />
                  <TextInput
                    style={[
                      styles.input,
                      { color: textColor }
                    ]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={colors.gray[500]}
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                  Email Address
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: inputBgColor }]}>
                  <Mail size={20} color={colors.gray[500]} />
                  <TextInput
                    style={[
                      styles.input,
                      { color: textColor }
                    ]}
                    value={email}
                    editable={false}
                    placeholder="Your email"
                    placeholderTextColor={colors.gray[500]}
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                  Phone Number
                </Text>
                <View style={[styles.inputContainer, { backgroundColor: inputBgColor }]}>
                  <Phone size={20} color={colors.gray[500]} />
                  <TextInput
                    style={[
                      styles.input,
                      { color: textColor }
                    ]}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Your phone number"
                    placeholderTextColor={colors.gray[500]}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Mail size={20} color={theme === 'dark' ? colors.gray[400] : colors.gray[500]} />
                <Text style={[styles.infoText, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                  {user?.email || 'No email set'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Phone size={20} color={theme === 'dark' ? colors.gray[400] : colors.gray[500]} />
                <Text style={[styles.infoText, { color: theme === 'dark' ? colors.gray[300] : colors.gray[700] }]}>
                  {user?.phone || 'No phone number set'}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={[styles.preferencesCard, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Preferences
          </Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Moon size={20} color={theme === 'dark' ? colors.gray[400] : colors.gray[500]} />
              <Text style={[styles.preferenceText, { color: textColor }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.gray[300], true: colors.primary[400] }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
              ios_backgroundColor={colors.gray[300]}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: cardBgColor }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error[500]} />
          <Text style={styles.logoutText}>Log Out</Text>
          <ChevronRight size={20} color={theme === 'dark' ? colors.gray[400] : colors.gray[500]} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primary[600],
  },
  editButtonText: {
    fontFamily: fonts.button,
    color: colors.white,
    fontSize: 14,
  },
  profileCard: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: fonts.heading,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontFamily: fonts.heading,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userRole: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  infoSection: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 16,
    marginLeft: 12,
  },
  formSection: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  cancelButtonText: {
    fontFamily: fonts.button,
    color: colors.gray[700],
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.primary[600],
  },
  saveButtonText: {
    fontFamily: fonts.button,
    color: colors.white,
    fontSize: 16,
  },
  preferencesCard: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontFamily: fonts.body,
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.error[600],
    flex: 1,
    marginLeft: 12,
  },
});