import styled from 'styled-components/native'
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';

export const Container = styled.View`
    flex: 1;
    padding: 0 32px;
    padding-top: ${Constants.statusBarHeight + 20}px;
`;

export const BackButton = styled.TouchableOpacity``;

export const Icon = styled(Feather)``;

export const Title = styled.Text`
    font-size: 20px;
    font-family: 'Ubuntu_700Bold';
    margin-top: 24px;
`;

export const Description = styled.Text`
    color: #6c6c80;
    font-size: 16px;
    margin-top: 4px;
    font-family: 'Roboto_400Regular';
`;

export const MapContainer = styled.View`
    flex: 1;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 16px;
`;

export const Map = styled(MapView)`
    width: 100%;
    height: 100%;
`;

export const MapMarker = styled(Marker)`
    width: 90px;
    height: 80px;
`;

export const MapMarkerContainer = styled.View`
    width: 90px;
    height: 70px;
    background-color: #34cb79;
    flex-direction: column;
    border-radius: 8px;
    overflow: hidden;
    align-items: center;
`;

export const MapMarkerImage = styled.Image`
    width: 90px;
    height: 45px;
    resize-mode: cover;
`;

export const MapMarkerTitle = styled.Text`
    flex: 1;
    font-family: 'Roboto_400Regular';
    font-size: 12px;
    color: #fff;
    text-align: center;

`;

export const ItemsContainer = styled.View`
    flex-direction: row;
    margin-top: 16px;
    margin-bottom: 32px;
`;

export const ItemsScroll = styled.ScrollView``;

export const Item = styled.TouchableOpacity`
    background-color: #fff;
    border: 2px solid #eee;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    padding: 20px 16px 16px;
    margin-right: 8px;
    align-items: center;
    justify-content: space-between;
    text-align: center;
`;

export const SelectedItem = {
    borderWidth: 2,
    borderColor: '#34cb79'
};

export const ItemImage = styled(SvgUri)``;

export const ItemTitle = styled.Text`
    font-family: 'Roboto_400Regular';
    text-align: center;
    font-size: 13px;
`;