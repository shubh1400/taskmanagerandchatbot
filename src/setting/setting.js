import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useTheme } from '../context/themeContext';
import styles from '../styles/setting.css'

const Setting = ({ onLogout }) => {
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      onLogout()
      console.log('User logged out');
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#000' : '#f8f9fa' }
    ]}>
      <View style={[styles.labelContainer, { marginTop: 5 }]}>
        <Text style={[styles.textmodel, { color: isDark ? '#fff' : '#555' }]}>
          Switch Mode
        </Text>
        <Switch
          onValueChange={toggleTheme}
          value={isDark}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
      <View style={[styles.labelContainer, { marginTop: 35 }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default Setting;
