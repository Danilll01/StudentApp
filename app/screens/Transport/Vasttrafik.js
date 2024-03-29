import axios from 'axios';
import qs from 'qs-stringify';
import VTkey from '../../APIKey.js';
import { getData, storeData } from '../../DataStorage.js';
import uuid from 'react-native-uuid';

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

export const GenerateAndStoreToken = () => {
    getData('@tokenDataVT').then((res) => {
      // Get new token if expired 
      if(res === null || res.expiry <= Date.now()) {
        getToken().then(token => {
          storeData('@tokenDataVT', token)
        });
      };
    });
};

export const GetDepatureBoard = async (stopId) => {
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

export const GetNearestStop = async (GPSlat, GPSlon) => {
    let APIEndpoint = "https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?";

    let payload = qs({
        originCoordLat: GPSlat,  // 57.706717, Test location
        originCoordLong: GPSlon, // 11.968428,
        maxNo: 100,
        format: "json",
    });

    let res = await CallVTAPIWithPayload(APIEndpoint, payload);

    // Sort the stops by longitude and latitude distance
    res.data.LocationList.StopLocation.map(stop => {
        return {
            ...stop,
            distance: getDistance(GPSlat, GPSlon, stop.lat, stop.lon)
        }
    }).sort((a, b) => {
        return a.distance - b.distance;
    }).map(stop => {
        return stop.id;
    });

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

// Calculates distance between latitudes and longitudes in meters
function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = (R * c) / 1000; // Distance in meters
    return d;
}

// Converts degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function DateToFormattedString(d) {         
    let yyyy = d.getFullYear().toString();                                    
    let mm = (d.getMonth()+1).toString(); // getMonth() is zero-based         
    let dd  = d.getDate().toString();

    let mmString = (mm[1] ? mm : "0" + mm[0]);
    let ddString = (dd[1] ? dd : "0" + dd[0]);

    return yyyy + '-' + mmString + '-' + ddString;
};  