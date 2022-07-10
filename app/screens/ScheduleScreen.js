import React, {Component, useState, useEffect, useCallback} from 'react';
//import { Button, Image, Linking, Alert, StatusBar, Platform, Text, SafeAreaView, View } from 'react-native';
import { SafeAreaView, Appearance } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from "moment";

// UI library 
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';

import styles from './ScreenStyle.js'

function ScheduleScreen(props)  {
    const [events, setEvents] = useState();
    const [theme, setTheme] = useState(getColorTheme);


    
    const loadEvents = () => {
        setEvents(
            {
                '2022-06-30': [{name: 'item 1 - any js object'}],
                '2022-06-23': [{name: 'item 2 - any js object', height: 80}],
                '2022-06-24': [],
                '2022-06-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
            }
        );
    }

    const renderItem = (item) => {
        return (
            <ApplicationProvider {...eva} theme={theme}>
                <Card>
                    <Text>Hello</Text>
                </Card>
            </ApplicationProvider>
        );
    }


    return (
        
        <ApplicationProvider {...eva} theme={theme}>
            <SafeAreaView style={styles.container}>
                <Layout style={{flex: 1}}>
                    <Text style={styles.headerText}>Schema!</Text>
                    <Agenda
                        items={events}
                        minDate={'2022-05-10'}
                        pastScrollRange={25}
                        futureScrollRange={25}
                        loadItemsForMonth={loadEvents}
                        selected={moment().format("YYYY-MM-DD")}
                        renderItem={renderItem}
                        showClosingKnob={true}
                        hideExtraDays={true}
                        /*
                        theme={{
                            
                            backgroundColor: theme['background-basic-color-4'],
                            calendarBackground: theme['background-basic-color-1'],
                            textSectionTitleColor: theme['color-basic-100'],
                            dayTextColor: theme['color-basic-100'],
                        }}
                        
                        */
                    />
                </Layout>
                <Button title="Change theme" onPress={() => {
                    if (theme === eva.dark) {
                        setTheme(eva.light);
                    } else {
                        setTheme(eva.dark);
                    }
                }}>Change theme</Button>
            </SafeAreaView>
        </ApplicationProvider>
    );
}

function getColorTheme() {
    const colorTheme = Appearance.getColorScheme();
    if (colorTheme === 'dark') {
        return eva.dark;
    } else {
        return eva.light;
    }
}

export default ScheduleScreen;