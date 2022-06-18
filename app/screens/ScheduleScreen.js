import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View, Image, Linking, Alert, StatusBar, Platform } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import styles from './ScreenStyle.js'

function ScheduleScreen(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Schema!</Text>
            <Agenda
                items={{
                    '2022-06-22': [{name: 'item 1 - any js object'}],
                    '2022-06-23': [{name: 'item 2 - any js object', height: 80}],
                    '2022-06-24': [],
                    '2022-06-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
                  }}
            >

            </Agenda>
        </SafeAreaView>
    );
}

export default ScheduleScreen;