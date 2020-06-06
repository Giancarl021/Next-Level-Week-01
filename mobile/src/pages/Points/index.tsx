import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Container, BackButton, Icon, Title, Description, MapContainer, Map, MapMarker, MapMarkerImage, MapMarkerContainer, MapMarkerTitle, ItemsContainer, ItemsScroll, Item, SelectedItem, ItemTitle, ItemImage } from './styles';
import * as Location from 'expo-location';
import api from '../../services/api';

interface Params {
    uf: string;
    city: string;
}

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface Point {
    id: number;
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    uf: string;
    city: string;
}

const Points = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const navigation = useNavigation();
    const route = useRoute();

    const { uf, city } = route.params as Params;

    useEffect(() => {
        async function loadPosition() {
            const { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Ooops', 'Precisamos de sua permissão para obter sua localização');
                return;
            }

            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;
            setInitialPosition([latitude, longitude]);
        }

        loadPosition();
    }, []);

    useEffect(() => {
        api.get('items')
            .then(response => {
                setItems(response.data);
            });
    }, []);

    useEffect(() => {
        if (!selectedItems.length) {
            setPoints([]);
            return;
        }
        api.get('points', {
            params: {
                city,
                uf,
                items: selectedItems.join(',')
            }
        }).then(response => {
            setPoints(response.data);
        })
    }, [selectedItems]);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(pointId: number) {
        navigation.navigate('Detail', { pointId });
    }

    function handleSelectItem(id: number) {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id))
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    return (
        <>
            <Container>
                <BackButton>
                    <Icon
                        name="arrow-left"
                        size={28}
                        color="#34cb79"
                        onPress={handleNavigateBack}
                    />
                </BackButton>
                <Title>Bem vindo</Title>
                <Description>Encontre no mapa um ponto de coleta</Description>
                <MapContainer>
                    {initialPosition[0] !== 0 && (
                        <Map
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}>
                            {points.map(point => (
                                <MapMarker
                                    key={String(point.id)}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude
                                    }}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                >
                                    <MapMarkerContainer>
                                        <MapMarkerImage source={{
                                            uri: point.image
                                        }} />
                                        <MapMarkerTitle>{point.name}</MapMarkerTitle>
                                    </MapMarkerContainer>
                                </MapMarker>
                            ))}
                        </Map>
                    )}
                </MapContainer>
            </Container>
            <ItemsContainer>
                <ItemsScroll
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20
                    }}
                >
                    {items.map(item => {
                        return (
                            <Item
                                {...(selectedItems.includes(item.id) ? { style: SelectedItem } : {})}
                                key={String(item.id)}
                                onPress={() => { handleSelectItem(item.id) }}
                                activeOpacity={0.6}
                            >
                                <ItemImage
                                    width={42}
                                    height={42}
                                    uri={item.image_url}
                                />
                                <ItemTitle>
                                    {item.title}
                                </ItemTitle>
                            </Item>
                        );
                    })}
                </ItemsScroll>
            </ItemsContainer>
        </>
    );
};

export default Points;