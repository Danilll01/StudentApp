import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import { SafeAreaView, View, Text, ScrollView, Button, Linking } from 'react-native';
import styles from './ScreenStyle.js'
import VtStopWidget from '../widgets/VtStopWidget.js';
import { getData, storeData } from '../DataStorage.js';

import uuid from 'react-native-uuid';
import qs from 'qs-stringify';
import xml2j from 'react-native-xml2js';

const VTkey = "KEY";

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
          Authorization: `Basic ${VTkey}`,
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
        //console.log(res);
        if(res === null || res.expiry < Date.now()) {
          getToken().then(token => {console.log("needed"); storeData('@tokenDataVT', token)});
        } else {
            console.log("Not needed")
        };
    });
    console.log("1")
} 

const GetVTDataTest = async () => {
    let VTaccessToken;
    await getData('@tokenDataVT').then((token) => {
        console.log(token.access_token);
        VTaccessToken = token.access_token;
        console.log("2")
    })
    console.log(VTaccessToken);
    const res = await axios
    .get(
        "https://api.vasttrafik.se/bin/rest.exe/v2/location.name?" +
        qs({
        input: "Ytterby",
        format: "application/json",
      }),
      {
        headers: {
            "Authorization": `Bearer ${VTaccessToken}`,
            "content-type": "application/json",
            "Accept": "application/json"
        } 
      }
    ).then((res) => {
      return res
    })
    
  return {
    res
  };
}

const TestTest = async () => {
    let data;
    await GetVTDataTest().then((res) => {
        console.log("halleluja")
        xml2j.parseString(res.res.data,function (err, result) {
            data = result.LocationList.StopLocation;
        })
    }).catch((res) => {
        console.log(res)
    })
    
    return data;
}

function TransportScreen() {
    const [stationSearch, setStationSearch] = useState([]);

    useEffect(() => {
      let mounted = true;

      if(mounted) {
      GenerateAndStoreToken();
      TestTest().then(res => {
          setStationSearch(res);
      }).catch(err => {
          console.log(err.message);
      });

      }
      mounted = false;

      return () => {
        mounted = false;
      }
    }, [])
    
    let inputProps = {
        text: "hej"
    };
    
    
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.headerText}>Kollektivtrafik</Text>
                <View style={styles.widgetArea}>
                    <Button title="Hej" onPress={() => Linking.openURL('vaesttrafik://query?Z=Korsv%C3%A4gen%2C+G%C3%B6teborg&start')}> </Button>
                    
                    {stationSearch.map(item => {
                        return <Text>{item.$.name}</Text>;
                    })}

                    <VtStopWidget props={inputProps}></VtStopWidget>
                    <VtStopWidget></VtStopWidget>
                    <VtStopWidget></VtStopWidget>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default TransportScreen;