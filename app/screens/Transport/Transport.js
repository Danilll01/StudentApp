import React, {Component, useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { SafeAreaView, ScrollView, RefreshControl, Linking } from 'react-native';
import styles from '../ScreenStyle.js'

// UI library 
import * as eva from '@eva-design/eva';
import { Layout, Text, Card, Button, useTheme, Icon } from '@ui-kitten/components';

import VtStopWidget from '../../widgets/VtStopWidget.js';
import { getData, storeData } from '../../DataStorage.js';

import uuid from 'react-native-uuid';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import qs from 'qs-stringify';
import VTkey from '../../APIKey.js';
import locationHandler from '../../LocationHandler.js';



function TransportScreen() {
    const theme = useTheme();

    const [stationSearch, setStationSearch] = useState([]);
    const [departureBoards, setDepartureBoards] = useState([]);
    const [nearestStop, setNearestStop] = useState([]);
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
function DateToFormattedString(d) {         
    let yyyy = d.getFullYear().toString();                                    
    let mm = (d.getMonth()+1).toString(); // getMonth() is zero-based         
    let dd  = d.getDate().toString();

    let mmString = (mm[1] ? mm : "0" + mm[0]);
    let ddString = (dd[1] ? dd : "0" + dd[0]);

    return yyyy + '-' + mmString + '-' + ddString;
};  

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

const getToken = async () => {
    const id = uuid.v4();
    const res = await axios
        .post(
            "https://api.vasttrafik.se/token",
        qs({
            grant_type: "client_credentials",
            scope: id
        }),
        {
            headers: {
            "Authorization": `Basic ${VTkey}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded;"
            }
        }
    );

    return {
        id,
        expiry: new Date().getTime() + res.data.expires_in * 1000,
        ...res.data
    };
};

function GenerateAndStoreToken() {
    getData('@tokenDataVT').then((res) => {
      // Get new token if expired 
      if(res === null || res.expiry <= Date.now()) {
        getToken().then(token => {
          storeData('@tokenDataVT', token)
        });
      };
    });
};

const GetDepatureBoard = async (stopId) => {
    console.log("Calling Dep API")

    let APIEndpoint = "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?";

    let payload = qs({
        id: stopId, // 9021014014715000
        date: DateToFormattedString(new Date()), // YYYY-MM-DD
        time: new Date().toTimeString().split(':').slice(0,2).join(':'), // HH:mm
        timeSpan: 120,
        format: "json",
        needJourneyDetail: 0,
    });
    
    let res = await CallVTAPIWithPayload(APIEndpoint, payload);
    return {res};
}

const GetNearestStop = async (GPSlat, GPSlon) => {
    let APIEndpoint = "https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?";

    let payload = qs({
        originCoordLat: GPSlat,  // 57.706717, Test location
        originCoordLong: GPSlon, // 11.968428,
        maxNo: 100,
        format: "json",
    });

    let res = await CallVTAPIWithPayload(APIEndpoint, payload);

    return {res};
}

// Calls västtrafiks api with provided endpoint and payload
const CallVTAPIWithPayload = async (APIEndpoint, payload) => {
    let VTaccessToken;

    // Retreive active token
    await getData('@tokenDataVT').then((token) => {
        VTaccessToken = token.access_token;
    })

    // Make request to api endpoint
    const res = await axios
    .get(
        APIEndpoint + payload,
        {
        // Use access token
        headers: {
            "Authorization": `Bearer ${VTaccessToken}`,
        } 
        }
    ).catch(err => {
        console.log(err.message);
    })

    return res;
}

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();

    return (
        promiseInProgress && 
        <Text>Hämtar västtrafik data</Text>
    );  
}

export default TransportScreen;