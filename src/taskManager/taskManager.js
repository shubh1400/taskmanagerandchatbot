import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    TouchableOpacity,
    Switch,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/taskmanager.css'
import DropDownPicker from "react-native-dropdown-picker";
import { useTaskDispatch, useTaskState } from "../context/taskContext";
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTheme } from "../context/themeContext";
import CreateTaskModal from "./model/createTaskModal";

const TaskManager = () => {
    const { isDark } = useTheme();
    const [payload, setPayload] = useState({ title: '', category: '', completed: false, date: null });
    const tasks = useTaskState()
    const setTasks = useTaskDispatch()
    const [showModel, setShowModel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [open, setOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [showFilterModule, setShowFilterModule] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [errors, setErrors] = useState({});
    const [filter, setFilter] = useState('All');
    const [items, setItems] = useState([
        { label: 'Work', value: 'Work' },
        { label: 'Personal', value: 'Personal' },
        { label: 'Urgent', value: 'Urgent' }
    ]);

    const [categories, setcategories] = useState([
        { label: 'All', value: 'All' },
        { label: 'Work', value: 'Work' },
        { label: 'Personal', value: 'Personal' },
        { label: 'Urgent', value: 'Urgent' }
    ]);
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const validatePayload = (data) => {
        const validationErrors = {};
        if (!data.title || data.title.trim() === '') {
            validationErrors.title = 'Title is required';
        }
        if (!data.category || data.category.trim() === '') {
            validationErrors.category = 'Category is required';
        }
        if (!data.date) {
            validationErrors.date = 'Date is required';
        }
        return validationErrors;
    };

    const handleAddOrSave = async () => {
        const validationErrors = validatePayload(payload);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }
        setErrors({});
        if (editIndex !== null) {
            const values = [...tasks];
            values[editIndex] = payload;
            setTasks(values);
            setEditIndex(null);
        } else {
            setTasks([...tasks, payload]);
        }
        setPayload({ title: '', category: '', completed: false, date: null });
        setShowModel(false);
        setIsLoading(false);
    };

    const handleEdit = (index) => {
        setShowModel(true);
        setPayload(tasks[index]);
        setEditIndex(index);
    };


    const handleDelete = async (index) => {
        const Delete = tasks.filter((_, i) => i !== index);
        setTasks(Delete);
    };

    const handleOpenModal = () => setShowModel(true);
    const handleCloseModal = () => {
        setShowModel(false);
        setPayload({ title: '', category: '', completed: false, date: null });
        setEditIndex(null);
        setErrors({});
    };

    const handleConfirm = (date) => {
        const localYmd = formatDateLocalYMD(date);
        setPayload({ ...payload, date: localYmd });
        hideDatePicker();
    };

    const parseLocalDateString = (ymd) => {
        const [y, m, d] = ymd.split("-");
        return new Date(y, m - 1, d);
    };

    const formatDateLocalYMD = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const filtered = useMemo(() => {
        return filter === 'All' ? tasks : tasks.filter(t => t.category === filter);
    }, [tasks, filter]);

    const completed = filtered.filter(t => t.completed).length;
    const total = filtered.length || 1;
    const percent = Math.round((completed / total) * 100);
    const urgentCount = tasks.filter(
        t => t.category === 'Urgent' && !t.completed
    ).length;

    const clearAllFilters = () => {
        setFilter('All');
    };

    const toggleFilterModule = () => {
        setShowFilterModule(!showFilterModule);
    };

    const closeFilterModule = () => {
        setShowFilterModule(false);
    };

    const filteredTasks = filter === 'All' ? tasks : tasks.filter((t) => t.category === filter);

    const renderTaskItem = ({ item, index }) => (
        <View key={index}>
            <View style={[styles.listCardContainer, { backgroundColor: isDark ? '#333' : '#fff' }]}>
                <Spinner
                    visible={isLoading}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFFFFF' }}
                />
                <View style={styles.labelContainer}>
                    <Text style={[styles.textTitleViewCourse, { color: isDark ? '#fff' : '#000' }]}>
                        {item.title}</Text>
                    <View style={styles.labelContainer}>
                        <TouchableOpacity style={styles.editDetails} onPress={() => handleEdit(index)}>
                            <Icon name="pencil" size={18} color={isDark ? '#ffcc00' : '#990000'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.editDetails} onPress={() => handleDelete(index)}>
                            <Icon name="trash" size={18} color={isDark ? '#ffcc00' : '#990000'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.labelContainer}>
                    <Text style={[styles.labelText, { color: isDark ? '#ccc' : '#555' }]}>Date:</Text>
                    <Text style={[styles.valueText, { color: isDark ? '#ccc' : '#555' }]}>{item.date}</Text>
                </View>
                <View style={styles.labelContainer}>
                    <Text style={[styles.labelText, { color: isDark ? '#ccc' : '#555' }]}>Category:</Text>
                    <Text style={[styles.valueText, , { color: isDark ? '#ccc' : '#555' }]}>{item.category}</Text>
                </View>
                <View style={[styles.labelContainer, { marginTop: 5 }]}>
                    <Text style={[styles.textSubtitleViewCourse, { color: isDark ? '#ccc' : '#555' }]}>Completed</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={item.completed ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                            const array = [...tasks]
                            array[index].completed = !item.completed
                            setTasks(array)
                        }}

                        value={item.completed}
                    />
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[
                    styles.container,
                    { backgroundColor: isDark ? '#000' : '#fff' }
                ]}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={{ flex: 1, backgroundColor: isDark ? '#222' : '#F0F0F0' }}>
                        <View style={[styles.percentBar, { backgroundColor: isDark ? '#444' : '#fff' }]}>
                            <Text style={{ color: isDark ? '#fff' : '#555' }}>Total tasks: {filtered.length}</Text>
                            <Text style={{ color: isDark ? '#fff' : '#555' }}>Completed: {completed}</Text>
                            <Text style={{ color: isDark ? '#fff' : '#555' }}>Pending: {filtered.length - completed}</Text>
                        </View>
                        <View style={[styles.percentCard, { backgroundColor: isDark ? '#333' : '#fff' }]}>
                            <Text style={{ color: isDark ? '#fff' : '#555', marginBottom: 12, marginHorizontal: 20 }}>Completion</Text>
                            <View style={[styles.percentshow, { backgroundColor: isDark ? '#444' : '#fff' }]}>
                                <View style={{ width: `${percent}%`, backgroundColor: '#4CAF50', height: '100%' }} />
                            </View>
                            <Text style={{ color: isDark ? '#fff' : '#555', marginHorizontal: 25 }} >{percent}% completed</Text>
                            <View style={styles.ClearFilterView}>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {filter !== 'All' && (
                                        <TouchableOpacity onPress={clearAllFilters} style={styles.ClearFilter}>
                                            <Text style={styles.ClearFilterText}>Clear All</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={toggleFilterModule} style={styles.FilterModuleOpen}>
                                        <Text style={styles.FilterText}>Filter</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>


                        {showFilterModule && (
                            <TouchableOpacity
                                style={styles.showFilterModule}
                                onPress={closeFilterModule}
                            />
                        )}
                        {showFilterModule && (
                            <View style={[styles.FilterModuleView, { backgroundColor: isDark ? '#333' : '#fff' }]}>
                                <View style={styles.FiltersView}>
                                    <Text style={[styles.FiltersOpen, { color: isDark ? '#fff' : '#000' }]}>Advanced Filters</Text>
                                    <TouchableOpacity onPress={closeFilterModule}>
                                        <Icon name="close" size={20} color={isDark ? '#fff' : '#666'} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 16, marginBottom: 16 }}>
                                    <Text style={[styles.categoryText, { color: isDark ? '#fff' : '#000' }]}>Category</Text>
                                    <DropDownPicker
                                        open={filterOpen}
                                        value={filter}
                                        items={categories}
                                        setOpen={setFilterOpen}
                                        setValue={(value) => {
                                            setFilter(value());
                                        }}
                                        setItems={setcategories}
                                        placeholder="Select category"
                                        listMode="SCROLLVIEW"
                                        scrollViewProps={{ nestedScrollEnabled: true }}
                                        textStyle={{ color: isDark ? '#333' : '#000' }}
                                        dropDownContainerStyle={{ backgroundColor: isDark ? '#fff' : '#fff' }}
                                    />
                                </View>
                            </View>
                        )}
                        {!isLoading && (
                            <FlatList
                                data={filteredTasks}
                                renderItem={renderTaskItem}
                                keyExtractor={(item, index) => index.toString()}
                                contentContainerStyle={[styles.scrollViewContainer, { paddingBottom: 80 }]}
                                keyboardShouldPersistTaps="handled"
                                keyboardDismissMode="on-drag"
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                        <CreateTaskModal
                            visible={showModel}
                            onClose={handleCloseModal}
                            payload={payload}
                            setPayload={setPayload}
                            editIndex={editIndex}
                            errors={errors}
                            items={items}
                            setItems={setItems}
                            open={open}
                            setOpen={setOpen}
                            isDatePickerVisible={isDatePickerVisible}
                            showDatePicker={showDatePicker}
                            hideDatePicker={hideDatePicker}
                            handleAddOrSave={handleAddOrSave}
                            handleConfirm={handleConfirm}
                        />
                        <TouchableOpacity style={[styles.fab]} onPress={handleOpenModal} activeOpacity={0.85}>
                            <Icon name="plus" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default TaskManager;