import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Container, BackButton, Icon, PointImage, PointName, PointItems, Address, AddressTitle, AddressContent, Footer, Button, ButtonText, FAIcon, MasterContainer } from './styles';
import * as MailComposer from 'expo-mail-composer';
import api from '../../services/api';

interface Params {
    pointId: number;
}

interface PointData {
    id: number;
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    uf: string;
    city: string;
    items: string[];
}

const Detail = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [data, setData] = useState<PointData>({
        id: 0,
        image: 'https://dummyimage.com/600x400/eee/34cb75.jpg&text=Loading',
        name: '',
        email: '',
        whatsapp: '',
        latitude: 0,
        longitude: 0,
        uf: '',
        city: '',
        items: [],
    });

    const { pointId } = route.params as Params;

    useEffect(() => {
        api.get(`points/${pointId}`)
            .then(response => {
                setData(response.data);
            });
    }, []);

    function handleNavigateBack() {
        if (!data.id) return;
        navigation.goBack();
    }

    function handleComposeMail() {
        MailComposer.composeAsync({
            recipients: [data.email],
            subject: 'Interesse na coleta de resíduos'
        });
    }

    function handleSendWhatsApp() {
        Linking.openURL(`whatsapp://send?phone=${data.whatsapp}&text=Tenho interesse na coleta de resíduos`);
    }

    return (
        <MasterContainer>
            <Container>
                <BackButton>
                    <Icon
                        name="arrow-left"
                        size={28}
                        color="#34cb79"
                        onPress={handleNavigateBack}
                    />
                </BackButton>
                <PointImage
                    source={{
                        uri: data.image
                    }}
                />

                <PointName>{data.name}</PointName>
                <PointItems>{data.items.join(', ')}</PointItems>
                <Address>
                    <AddressTitle>Endereço</AddressTitle>
                    <AddressContent>{data.city}, {data.uf}</AddressContent>
                </Address>
            </Container>
            <Footer>
                <Button onPress={handleSendWhatsApp}>
                    <FAIcon
                        name="whatsapp"
                        size={20}
                        color="#fff"
                    />
                    <ButtonText>WhatsApp</ButtonText>
                </Button>
                <Button onPress={handleComposeMail}>
                    <Icon
                        name="mail"
                        size={20}
                        color="#fff"
                    />
                    <ButtonText>E-Mail</ButtonText>
                </Button>
            </Footer>
        </MasterContainer>
    );
};

export default Detail;