import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './WidgetStyles.js';
import moment from "moment";

function getDepTimeDiff(date, time) {
    var ms = moment(moment(date + " " + time,"YYYY-MM-DD HH:mm")).diff(moment().format("YYYY-MM-DD HH:mm"));
    var d = moment.duration(ms);
    var s;
    if (d.asMinutes() <= 0) {
        s = "Avgått"
      } else if(d.hours() !== 0) {
        s = time;
       } else {
        s = moment.utc(ms).format("m") + " min";
      }
    return s;
}

function VtStopWidget(props) {
    const [departureList, setDepartureList] = useState([]);
    
    useEffect(() => {
        let mounted = true;
        
        if(mounted) {
            setDepartureList([]);
            if (Object.keys(props).length != 0) {
            if (Object.keys(props.props).length > 0) {
                //console.log(props);
                //console.log(props.props.DepartureBoard.Departure.slice(0, 5));
                if (typeof props.props.DepartureBoard.Departure !== undefined) {
                    setDepartureList(props.props.DepartureBoard.Departure.slice(0,6));
                }
            };
        };
        
       mounted = false;
       return () => {
        mounted = false;
      }
    }
    }, [props])
    
    
    return (
        <View style={styles.basicWidget}>
            <Text h1 style={styles.basicWidgetHeader}>
                {(typeof departureList === undefined) || (departureList.length == 0) ? "test" : departureList[0].stop.split(',')[0]}
            </Text>
            {departureList.map((ride) => {
                return (
                <View style={VtStopWidgetStyle.rideItem} key={ride.journeyid}>
                    <View style={{backgroundColor: ride.bgColor, width: 45, height: 33, borderRadius: 5, justifyContent: 'center'}}>
                        <Text style={{color: ride.fgColor, textAlign: 'center', fontWeight: 'bold', fontSize: 14,}}>{ride.sname}</Text>
                    </View>
                    <Text style={VtStopWidgetStyle.rideName}>{"Mot " + ride.direction}</Text>
                    <Text style={{marginLeft: 'auto'}}>{getDepTimeDiff(ride.date, ride.time)}</Text>
                </View>)
            })}
        </View>
    );
}

const VtStopWidgetStyle = StyleSheet.create({
    rideItem: {
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 0,
    },
    rideName: {
        width: '60%',
        paddingLeft:5,
    }
})

export default VtStopWidget;