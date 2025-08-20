import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from '../../styles/taskmanager.css'
import { useTheme } from "../../context/themeContext";

const CreateTaskModal = ({
    visible,
    onClose,
    payload,
    setPayload,
    editIndex,
    errors,
    items,
    setItems,
    open,
    setOpen,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleAddOrSave,
    handleConfirm,

}) => {
    const { isDark } = useTheme();

    const parseLocalDateString = (ymd) => {
        const [y, m, d] = ymd.split("-");
        return new Date(y, m - 1, d);
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}>
            <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)' }
            ]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, justifyContent: 'center', marginBottom: 20 }}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ alignContent: "center", justifyContent: "center", flexDirection: "column", }}>
                            <View style={[styles.modalContent, { backgroundColor: isDark ? '#333' : '#fff' }
                            ]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>{editIndex !== null ? 'Edit Task' : 'Add Task'}</Text>
                                    <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                                        <Icon name="close" size={20} color={isDark ? '#fff' : '#000'} />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={[styles.textheader, { color: isDark ? '#fff' : '#000' }]}>Title</Text>
                                    <TextInput
                                        value={payload.title}
                                        onChangeText={(text) => setPayload({ ...payload, title: text })}
                                        placeholder="Task title"
                                        placeholderTextColor={isDark ? '#777' : '#ABA9A9'}
                                        style={[styles.textInput, { color: isDark ? '#333' : '#000', borderColor: isDark ? '#555' : '#ccc' }
                                        ]}
                                        autoFocus
                                    />
                                    {errors.title && (
                                        <View style={{ marginBottom: 12, marginLeft: 10 }}>
                                            <Text style={{ color: 'red' }}>{errors.title}</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={{ zIndex: 1000 }}>
                                    <Text style={[styles.textheader, { color: isDark ? '#fff' : '#000' }]}>Category</Text>
                                    <DropDownPicker
                                        open={open}
                                        value={payload.category}
                                        items={items}
                                        setOpen={setOpen}
                                        setValue={(valueOrFn) => {
                                            setPayload({ ...payload, category: valueOrFn() })
                                        }}
                                        setItems={setItems}
                                        placeholder="Select task"
                                        listMode="SCROLLVIEW"
                                        scrollViewProps={{
                                            nestedScrollEnabled: true,
                                        }}
                                        textStyle={{ color: isDark ? '#333' : '#000' }}
                                        dropDownContainerStyle={{ backgroundColor: isDark ? '#fff' : '#fff' }}
                                    />
                                    {errors.category && (
                                        <View style={{ marginLeft: 10, marginTop: 5 }}>
                                            <Text style={{ color: 'red' }}>{errors.category}</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={{ marginTop: 15 }}>
                                    <Text style={[styles.textheader, { color: isDark ? '#fff' : '#000' }]}>Date</Text>
                                    <View >
                                        <TouchableOpacity onPress={showDatePicker} style={
                                            styles.dateselection}>
                                            <Text style={{ color: isDark ? '#fff' : '#333' }}>
                                                {payload.date
                                                    ? parseLocalDateString(payload.date).toDateString()
                                                    : "Select Date"}
                                            </Text>
                                        </TouchableOpacity>
                                        {errors.date && (
                                            <View style={{ marginBottom: 2, marginLeft: 10 }}>
                                                <Text style={{ color: 'red' }}>{errors.date}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="date"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                    />
                                </View>
                                <View style={styles.modalActions}>
                                    <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
                                        <Text style={[styles.buttonTextSecondary, { color: isDark ? '#fff' : '#000' }]}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleAddOrSave}
                                        style={styles.primaryButton}
                                    >
                                        <Text style={styles.buttonTextPrimary}>{editIndex !== null ? 'Save' : 'Add'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default CreateTaskModal;
