import React, { useState, useEffect, useCallback } from "react";
import { sendMessage, subscribeToChat } from './subscribeToChat';
import { getAuth } from '@react-native-firebase/auth';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { useTheme } from "../context/themeContext";
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const { isDark } = useTheme();

  const onSend = useCallback((msg = []) => {
    const { text, user } = msg[0];
    sendMessage(text, user._id)
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToChat(setMessages);
    return () => unsubscribe();
  }, []);

  const user = getAuth().currentUser;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: user.uid }}
        textInputStyle={{
          color: isDark ? "#fff" : "#000",
          backgroundColor: isDark ? "#333" : "#f0f0f0",
          borderRadius: 20,
          paddingHorizontal: 15,
          marginLeft: 10,
        }}

        listViewProps={{
          style: { backgroundColor: isDark ? "#000" : "#fff" },
        }}
        renderSend={(props) => (
          <Send {...props}>
            <View style={{ marginRight: 15, marginBottom: 5, }}>
              <Text style={{ color: isDark ? "#fff" : "#007AFF", fontWeight: "bold", marginLeft: 15, marginBottom: 3 }}>
                <Icon name="send" size={28} color={isDark ? '#ffcc00' : '#990000'} />
              </Text>
            </View>
          </Send>
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: isDark ? "#1E90FF" : "#007AFF",
                borderRadius: 15,
                marginBottom: 8,
                marginRight: 20,
              },
              left: {
                backgroundColor: isDark ? "#555" : "#f0f0f0",
                borderRadius: 15,
                marginBottom: 8,
                marginLeft: 1,
              },
            }}
            textStyle={{
              right: {
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                fontFamily: "Helvetica",
              },
              left: {
                color: isDark ? "#fff" : "#000",
                fontSize: 16,
                fontWeight: "400",
                fontFamily: "Helvetica",
              },
            }}
            containerStyle={{
              left: { justifyContent: "flex-start" },
              right: { justifyContent: "flex-end" },
            }}
          />
        )}
        alwaysShowSend
        scrollToBottom
      />
    </KeyboardAvoidingView>
  );
};


export default Chatbot;
