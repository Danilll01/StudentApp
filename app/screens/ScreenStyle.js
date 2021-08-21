import { StyleSheet, Platform, StatusBar } from 'react-native';

const sideMargin = '5%';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerText: {
    paddingTop: 20,
    paddingLeft: sideMargin,
    paddingBottom: 20,
    fontSize: 34,
    fontWeight: 'bold',
  },
  basicWidget: {
    backgroundColor: 'red',
    marginLeft: sideMargin,
    width: '90%',
    height: 300,
    borderRadius: 16,
  },
  widgetArea: {
    marginLeft: sideMargin,
    width: '90%',
  }
});