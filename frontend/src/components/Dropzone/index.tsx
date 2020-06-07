import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
    const [selectedFileUrl, setSelectedFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        onFileUploaded(file);
        const fileUrl = URL.createObjectURL(file);
        setSelectedFileUrl(fileUrl);
    }, [onFileUploaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />
            {
                selectedFileUrl ?
                    <img src={selectedFileUrl} alt="Imagem do estabelecimento" /> :
                    (
                        <p>
                            <FiUpload />
                            {isDragActive ? 'Solte a imagem aqui' : 'Arraste a imagem do estabelecimento aqui, ou clique para selecionar'}
                        </p>
                    )
            }
        </div>
    );
};

export default Dropzone;