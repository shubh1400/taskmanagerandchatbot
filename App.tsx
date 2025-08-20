/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TaskManager from './src/taskManager/taskManager';
import { TaskProvider } from './src/context/taskContext'
import Agenda from './src/agenda/agenda'
import LoginScreen from './src/logIn/logIn';
import Chatbot from './src/chatbot/chatbot';
import Setting from './src/setting/setting';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeProvider, useTheme } from './src/context/themeContext';

const Tab = createBottomTabNavigator();

function RootTab({ setIsLoggedIn }: any) {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = 18;
          if (route.name === 'Task Manager') {
            iconName = 'tasks';
            iconSize = 18;
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
            iconSize = 18;
          } else if (route.name === 'Chatbot') {
            iconName = 'comments';
            iconSize = 18;
          } else if (route.name === 'Setting') {
            iconName = 'cog';
            iconSize = 18;
          } else if (route.name === 'Dashboard') {
            iconName = 'home';
            iconSize = 18;
          }

          return <Icon name={iconName!} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: isDark ? '#4d94ff' : '#4CAF50',
        tabBarInactiveTintColor: isDark ? '#aaa' : 'gray',
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#333' : '#ccc',
        },
      })}
    >
      <Tab.Screen name='Task Manager' component={TaskManager} options={{
        tabBarLabelStyle: { fontSize: 12, color: isDark ? '#fff' : '#000' },
      }} />
      <Tab.Screen name='Calendar' component={Agenda} options={{
        tabBarLabelStyle: { fontSize: 12, color: isDark ? '#fff' : '#000' },
      }} />
      <Tab.Screen name='Chatbot' component={Chatbot} options={{
        tabBarLabelStyle: { fontSize: 12, color: isDark ? '#fff' : '#000' },
      }} />
      <Tab.Screen
        name='Setting'
        component={() => <Setting onLogout={() => setIsLoggedIn(false)} />}
        options={{
          tabBarLabelStyle: { fontSize: 12, color: isDark ? '#fff' : '#000' },
        }}
      />
    </Tab.Navigator>
  )
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <TaskProvider>
            {isLoggedIn ? (
              <RootTab setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )}
          </TaskProvider>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


export default App;
