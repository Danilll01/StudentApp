import React, {Component, useState, useEffect, useCallback} from 'react';
import { SafeAreaView, ScrollView, RefreshControl, Linking } from 'react-native';
import styles from '../ScreenStyle.js'

// UI library 
import * as eva from '@eva-design/eva';
import { Layout, Text, Card, Button, useTheme, Icon } from '@ui-kitten/components';

import { GenerateAndStoreToken, GetDepatureBoard, GetNearestStop } from './Vasttrafik.js';
import VtStopWidget from '../../widgets/VtStopWidget.js';

import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import locationHandler from '../../LocationHandler.js';



function TransportScreen() {
    const theme = useTheme();

    const [nearStopIDs, setNearStopIDs] = useState([]);
    const [latestUpdate, setLatestUpdate] = useState(Date.now());
    const [location, setLocation] = useState([]);
    const [refreshing, setRefreshing] = useState();
    
    const refreshJourneys = React.useCallback(async () => {
        setRefreshing(true);
        console.log("Refreshing journeys");

        GenerateAndStoreToken();

        trackPromise( locationHandler().then((res) => {
            setLocation(res);
            GetNearestStop(res.coords.latitude, res.coords.longitude).then(res => {

                // Get unique stations
                let stations = res?.res?.data.LocationList.StopLocation;
                let uniqueStations = getUniqueStations(stations);

                // Update stop IDs and latest update
                setNearStopIDs(uniqueStations.sort());
                setLatestUpdate(Date.now());

            }).catch(err => {
                console.log(err);
            })

        }));

        setRefreshing(false);
    }, []);

    useEffect(() => {
        let mounted = true;

        if(mounted) {
            refreshJourneys();
        }

        mounted = false;

        return () => {
            mounted = false;
        }
    }, []);

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme['background-basic-color-1']}]}>
            <ScrollView 
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshJourneys}
                />
              }>
                <Text style={[styles.headerText, {paddingBottom: 4}]}>Kollektivtrafik 🚍</Text>
                <Text category='label' style={{paddingLeft: 20, paddingBottom: 10}}>Data hämtad {new Date(latestUpdate).toLocaleTimeString()}</Text>
                <Layout style={styles.widgetArea}>
                    {/* <Button title="Hej" onPress={() => Linking.openURL('vaesttrafik://query?Z=Korsv%C3%A4gen%2C+G%C3%B6teborg&start')}> </Button> */}
                    
                    <LoadingIndicator/>
                    
                    {nearStopIDs?.map((stopID) => {
                      return <VtStopWidget key={stopID} stopID={stopID} latestUpdate={latestUpdate}></VtStopWidget>
                    })}
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
}


// Helper functions 
function getUniqueStations(stations) {
    let uniqueStations = new Map();

    stations?.map(station => {
        // Add station to map if not already in map
        if (!uniqueStations.has(station.name)) {
            uniqueStations.set(station.name, station.id);
        }
    });

    return Array.from(uniqueStations.values());
}
// Helper funtions END



const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress && 
        <Text>Hämtar västtrafik data</Text>
    );  
}

export default TransportScreen;