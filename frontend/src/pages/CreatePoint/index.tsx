import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';
import Swal from 'sweetalert2';

import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    id: number;
    sigla: string;
    nome: string;
    regiao: {
        id: number;
        sigla: string;
        nome: string;
    };
}

interface IBGECityResponse {
    id: number;
    nome: string;
    microrregiao: {
        id: number;
        nome: string;
        mesorregiao: {
            id: number;
            nome: string;
            uf: IBGEUFResponse;
        }
    }
}

interface MapPosition {
    latitude: number;
    longitude: number;
}

interface FormData {
    name: string;
    email: string;
    whatsapp: string;
}

const CreatePoint: React.FC = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('null');
    const [selectedCity, setSelectedCity] = useState('null');
    const [initialPosition, setInitialPosition] = useState<MapPosition>({
        latitude: 0,
        longitude: 0
    });
    const [selectedPosition, setSelectedPosition] = useState<MapPosition>({
        latitude: 0,
        longitude: 0
    });
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        whatsapp: ''
    });
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const history = useHistory();

    useEffect(() => {
        api
            .get('items')
            .then(response => {
                setItems(response.data);
            })
    }, []);

    useEffect(() => {
        axios
            .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then((response) => {
                setUfs(response.data.map(uf => uf.sigla));
            });
    }, []);

    useEffect(() => {
        if (selectedUf === 'null') {
            setCities([]);
            return;
        }
        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                setCities(response.data.map(city => city.nome));
            });
    }, [selectedUf]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(data => {
            const {
                latitude,
                longitude
            } = data.coords;
            setInitialPosition({
                latitude,
                longitude
            });
        });
    }, []);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition({
            latitude: event.latlng.lat,
            longitude: event.latlng.lng
        })
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    function handleSelectItem(id: number) {
        if(selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id))
        } else {
            setSelectedItems([ ...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const { latitude, longitude } = selectedPosition;
        const items = selectedItems;
        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        try {
            await api.post('points', data);
            Swal.fire({
                title: 'Ponto de Coleta criado',
                icon: 'success'
            });
            history.push('/');
        } catch (err) {
            Swal.fire({
                title: 'Erro!',
                text: err.response.data.message,
                icon: 'error'
              });
        }
        
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                Voltar para home
            </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> Ponto de Coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selectione o endereço no mapa</span>
                    </legend>

                    <Map center={[initialPosition.latitude, initialPosition.longitude]} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={[selectedPosition.latitude, selectedPosition.longitude]} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSelectUf}
                            >
                                <option value="null">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="null">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {
                            items.map(item => (
                                <li
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                    key={item.id}
                                    onClick={() => handleSelectItem(item.id)}
                                >
                                    <img src={item.image_url} alt={item.title} />
                                    <span>{item.title}</span>
                                </li>
                            ))
                        }
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar Ponto de Coleta</button>
            </form>
        </div>
    )
};

export default CreatePoint;