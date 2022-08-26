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

    const [departureBoards, setDepartureBoards] = useState([]);
    const [location, setLocation] = useState([]);
    const [refreshing, setRefreshing] = useState();
    
    const refreshJourneys = React.useCallback(async () => {
        setRefreshing(true);
        console.log("Refreshing journeys");

        GenerateAndStoreToken();

        trackPromise( locationHandler().then((res) => {
            setLocation(res);
            GetNearestStop(res.coords.latitude, res.coords.longitude).then(res => {
            setDepartureBoards([]); // Might want to update data rather than clearing and fetching new

            // Only proceed if we data from the api
            let stations = res?.res?.data.LocationList.StopLocation;
            let uniqueStations = getUniqueStations(stations);
            console.log(uniqueStations)
            uniqueStations.map(station => {
                GetDepatureBoard(parseInt(station)).then(depBoard => {
                setDepartureBoards(depBoards => [...depBoards, depBoard.res.data]);
                })
            })
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
                <Text style={styles.headerText}>Kollektivtrafik 🚍</Text>
                <Layout style={styles.widgetArea}>
                    {/* <Button title="Hej" onPress={() => Linking.openURL('vaesttrafik://query?Z=Korsv%C3%A4gen%2C+G%C3%B6teborg&start')}> </Button> */}
                    
                    <LoadingIndicator/>
                    
                    {departureBoards?.map((depBoard, index) => {
                      return <VtStopWidget key={index} depBoardData={depBoard}></VtStopWidget> //depBoard?.DepartureBoard?.Departure[0]?.stop
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