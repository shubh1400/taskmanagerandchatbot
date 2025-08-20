import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native';
import styles from '../styles/login.css'

const LoginScreen = ({ onLoginSuccess }) => {

  const [payload, setPayload] = useState({ email: '', password: '' })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const DUMMY_EMAIL = 'task@gmail.com';
  const DUMMY_PASSWORD = 'task1400@';
  const DUMMY_EMAIL1 = 'abc@gmail.com';
  const DUMMY_PASSWORD1 = '1234567';

  const handleLogin = async () => {
    if (!payload.email.trim() || !payload.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);

      const authInstance = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        authInstance,
        payload.email,
        payload.password
      );
      onLoginSuccess()
      console.log('User logged in:', userCredential);
    } catch (err) {
      console.log('Login error:', err.message);
    } finally {
      setIsLoading(false)
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality would be implemented here');
  };

  const handleSignUp = async () => {
    try {
      const result = await auth().createUserWithEmailAndPassword(
        DUMMY_EMAIL1,
        DUMMY_PASSWORD1,
      );
      console.log('✅ User registered', result.user.uid);
    } catch (err) {
      console.log('❌ Registration error:', err.message);
    }

  };


  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      onLoginSuccess()
      console.log('User Email:', currentUser.email);
      console.log('User UID:', currentUser.uid);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Task Manager</Text>
            <Text style={styles.subtitle}>Welcome back! Please sign in to continue.</Text>
            <Text style={styles.dummyCredentials}>use: abc@gmail.com / 1234567</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={payload.email}
                onChangeText={(text) => setPayload({ ...payload, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={payload.password}
                  onChangeText={(text) => setPayload({ ...payload, password: text })}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Text style={styles.eyeButtonText}>
                    {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
            </TouchableOpacity>
            
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
