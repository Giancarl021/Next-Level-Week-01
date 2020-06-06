import React, { useState } from 'react';
import { Platform } from 'react-native';
import { MasterContainer, Container, Main, TextContainer, Title, Description, Image, Footer, Button, ButtonIcon, ButtonText, Icon, Input } from './styles';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const navigation = useNavigation();

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    function handleNavigationToPoints() {
        navigation.navigate('Points', {
            uf: uf.toUpperCase(),
            city
        });
    }

    return (
        <MasterContainer behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Container
                source={require('../../assets/home-background.png')}
                imageStyle={{
                    width: 274,
                    height: 368
                }}
            >
                <Main>
                    <Image source={require('../../assets/logo.png')} />
                    <TextContainer>
                        <Title>Seu marketplace de coleta de resíduos</Title>
                        <Description>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Description>
                    </TextContainer>
                </Main>
                <Footer>
                    <Input
                        placeholder="Digite a UF"
                        maxLength={2}
                        spellCheck={false}
                        autoCorrect={false}
                        autoCapitalize="characters"
                        value={uf}
                        onChangeText={setUf}
                    />
                    <Input
                        placeholder="Digite a Cidade"
                        value={city}
                        spellCheck={false}
                        autoCorrect={false}
                        onChangeText={setCity}
                    />
                    <Button
                        onPress={handleNavigationToPoints}
                    >
                        <ButtonIcon>
                            <Icon
                                name="arrow-right"
                                color="#fff"
                                size={24}
                            />
                        </ButtonIcon>
                        <ButtonText>
                            Entrar
                    </ButtonText>
                    </Button>
                </Footer>
            </Container>
        </MasterContainer>
    );
}

export default Home;