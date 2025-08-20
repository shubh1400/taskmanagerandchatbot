import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTaskState } from '../context/taskContext';
import { useTheme } from '../context/themeContext';

const Agenda  = () => {
  const tasks = useTaskState();
  const { isDark } = useTheme();

  const [selectedDay, setSelectedDay] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const marks = {};
    tasks.forEach((task) => {
      if (task.date) {
        marks[task.date] = { marked: true };
      }
    });
    setMarkedDates(marks);
  }, [tasks]);

  const onDayPress = (day) => {
    setSelectedDay(day.dateString);
  };

  const selectedDayTasks = useMemo(() => {
    return tasks.filter((t) => t.date === selectedDay);
  }, [tasks, selectedDay]);

  return (
    <View style={[styles.container,        { backgroundColor: isDark ? '#000' : '#f2f2f2' }
    ]}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          ...(selectedDay && {
            [selectedDay]: {
              selected: true,
              selectedColor: isDark ? '#4d94ff' : '#00adf5'
            }
          })
        }}
        theme={{
          calendarBackground: isDark ? '#000' : '#fff',
          dayTextColor: isDark ? '#fff' : '#2d4150',
          monthTextColor: isDark ? '#fff' : '#2d4150',
          selectedDayBackgroundColor: isDark ? '#4d94ff' : '#00adf5',
          todayTextColor: isDark ? '#4d94ff' : '#00adf5',
          arrowColor: isDark ? '#4d94ff' : '#00adf5',
        }}
      />

      {selectedDayTasks.length === 0 && selectedDay !== '' ? (
        <Text style={[styles.emptyText,{ color: isDark ? '#ccc' : '#555' }]}>No tasks</Text>
      ) : (
        <FlatList
          data={selectedDayTasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card,{
              backgroundColor: isDark ? '#222' : '#fff',
              borderColor: isDark ? '#555' : '#000'
            }]}>
              <Text style={{ fontWeight:'600', color: isDark ? '#fff' : '#000' }}>{item.title}</Text>
              <Text style={{ color: isDark ? '#ccc' : '#000' }}>Category: {item.category}</Text>
              <Text style={{ color: isDark ? '#ccc' : '#000' }}>Completed: {item.completed ? 'Yes' : 'No'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderColor:"#000000",
    borderWidth:1,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
});

export default Agenda;
