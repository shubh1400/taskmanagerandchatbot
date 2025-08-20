import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 35,
        marginHorizontal: 20,
    },
    textmodel: {
        fontSize: 13,
        marginBottom: 2,
    },
});