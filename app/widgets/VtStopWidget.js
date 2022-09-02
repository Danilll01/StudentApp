import React, { useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import moment from "moment";

// UI library
import { Layout, Text, Card, Button, useTheme, Icon } from '@ui-kitten/components';

import { GenerateAndStoreToken, GetDepatureBoard, GetNearestStop } from '../screens/Transport/Vasttrafik.js';

const MAX_DISPLAY_RIDES = 6;

function VtStopWidget({ stopID, stopName, latestUpdate }) {
    const theme = useTheme();

    const [departureList, setDepartureList] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    useEffect(() => {
        setRefreshing(true);
        
        GenerateAndStoreToken();

        GetDepatureBoard(parseInt(stopID)).then(depBoard => {
            // Supply departured board with fetched data
            let depList = depBoard?.res?.data?.DepartureBoard?.Departure || [];

            setDepartureList(depList);

            setRefreshing(false);
        })
        
    }, [latestUpdate])
    
    return (
        <Layout style={[style.root, { backgroundColor: theme['background-basic-color-3'] }]}>
            <Text category='h1' style={style.header}>
                {departureList.length == 0 ? "Inga avgångar för " + stopName : departureList[0].stop.split(',')[0]}
            </Text>
            {departureList.slice(0, isExpanded ? departureList.length : MAX_DISPLAY_RIDES).map((ride, index) => {
                return (
                <Layout key={index} style={style.rideItem} >
                    <Layout style={[style.iconRoot, { backgroundColor: ride.bgColor }]}>
                        <Text style={[style.iconText, {color: ride.fgColor}]}>{ride.sname}</Text>
                    </Layout>
                    <Text style={style.rideName}>{"Mot " + ride.direction}</Text>
                    <Text style={{marginLeft: 'auto'}}>{getDepTimeDiff(ride.date, ride.time)}</Text>
                </Layout>)
            })}
            <TouchableOpacity 
                style={style.expandButton}
                onPress={() => {
                    setIsExpanded(!isExpanded);
                }}>
            
                <Icon 
                    name={'arrow-ios-' + (isExpanded ? "up" : "down") + 'ward-outline'} 
                    fill={theme['text-basic-color']} 
                    style={{width: 42, height: 42, marginLeft: 15}}
                />
            </TouchableOpacity>
            
        </Layout>
    );
}

const style = StyleSheet.create({
    root: {
        backgroundColor: '#EDEDED',
        marginBottom: 20,
        height: 'auto',
        borderRadius: 16,
    },
    header: {
        textAlign: 'center',
        paddingTop: 20,
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 22,
    },
    rideItem: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 0,
    },
    rideName: {
        width: '60%',
        paddingLeft:5,
    },
    iconRoot: {
        width: 45, 
        height: 33, 
        borderRadius: 5, 
        justifyContent: 'center'
    },
    iconText: {
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: 14
    },
    expandButton: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    }
    
})


// Returns the time difference between the current time and the departure time
function getDepTimeDiff(date, time) {
    var ms = moment(moment(date + " " + time,"YYYY-MM-DD HH:mm")).diff(moment().format("YYYY-MM-DD HH:mm"));
    var d = moment.duration(ms);
    var s;
    if (d.asMinutes() <= 0) {
        s = "Nu"
      } else if(d.hours() !== 0) {
        s = time;
       } else {
        s = moment.utc(ms).format("m") + " min";
      }
    return s;
}

export default VtStopWidget;