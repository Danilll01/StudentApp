import * as Location from 'expo-location';

export default getGPSLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log("Not granted. Status:" + status)
    }

    const userLocation = await Location.getCurrentPositionAsync();
    return userLocation;
}
