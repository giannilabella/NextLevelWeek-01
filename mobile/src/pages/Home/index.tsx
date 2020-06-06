import React, { useState, useEffect, ChangeEvent } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUfResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const Home = () => {
    const ufPlaceholder = {
        label: 'Selecione um Estado...',
        value: null,
    }

    const cityPlaceholder = {
        label: 'Selecione uma Cidade...',
        value: null,
    }

    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');


    useEffect(() => {
        axios
            .get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                const ufInitials =  response.data.map(uf => uf.sigla);

                setUfs(ufInitials);
            });
    }, [])

    useEffect(() => {
        if (selectedUf === '0') return;

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);
            });
    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<RNPickerSelect>) {
        const uf = String(event);

        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<RNPickerSelect>) {
        const city = String(event);

        setSelectedCity(city);
    }

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity,
        });
    }

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{width: 274, height: 368}}

        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>
                    Seu marketplace de coleta de resíduos.
                </Text>
                <Text style={styles.description}>
                    Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
                </Text>
            </View>

            <View style={styles.footer}>
                <RNPickerSelect
                    style={pickerStyles}
                    placeholder={ufPlaceholder}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={handleSelectUf}
                    items={
                        ufs.map(uf => (
                            { label: uf, value: uf, key: uf }
                        ))
                    }
                />

                <RNPickerSelect
                    style={pickerStyles}
                    placeholder={cityPlaceholder}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={handleSelectCity}
                    items={
                        cities.map(city => (
                            { label: city, value: city, key: city }
                        ))
                    }
                />

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Icon name="arrow-right" color="#fff" size={24} />
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
  
    main: {
        flex: 1,
        justifyContent: 'center',
    },
  
    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },
  
    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },
  
    footer: {},
  
    select: {
    },
  
    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
  
    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },
  
    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10
    },
  
    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

const pickerStyles = {
    inputIOS: {
        backgroundColor: '#e8e8ee',
        borderRadius: 10,
        marginTop: 8,
        height: 60,
        paddingHorizontal: 16,
        color: '#6C6C80',
	},
	inputAndroid: {
        backgroundColor: '#e8e8ee',
        borderRadius: 10,
        marginTop: 8,
        height: 60,
        paddingHorizontal: 16,
        color: '#6C6C80',
	},
}

export default Home;