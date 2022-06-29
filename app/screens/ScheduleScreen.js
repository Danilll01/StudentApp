import React, {Component, useState, useEffect, useCallback} from 'react';
import { Button, Image, Linking, Alert, StatusBar, Platform, Text, SafeAreaView, View, Card  } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from "moment";

// UI library 
//import * as eva from '@eva-design/eva';
//import { ApplicationProvider, Layout, Text, SafeAreaView, View, Card } from '@ui-kitten/components';

import styles from './ScreenStyle.js'

function ScheduleScreen(props)  {
    const [events, setEvents] = useState();
    
    const loadEvents = () => {
        setEvents(
            {
                '2022-06-22': [{name: 'item 1 - any js object'}],
                '2022-06-23': [{name: 'item 2 - any js object', height: 80}],
                '2022-06-24': [],
                '2022-06-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
            }
        );
    }

    const renderItem = (item) => {
        return (
            //<Card title={"Hej"}>
                <Text>Hello</Text>
            //</Card>
        );
    }


    return (
        
        //<ApplicationProvider {...eva} theme={eva.light}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.headerText}>Schema!</Text>
                <Agenda
                    items={events}
                    loadItemsForMonth={loadEvents}
                    selected={moment().format("YYYY-MM-DD")}
                    renderItem={renderItem}
                />
            </SafeAreaView>
        //</ApplicationProvider>
        
        
    );
}

export default ScheduleScreen;