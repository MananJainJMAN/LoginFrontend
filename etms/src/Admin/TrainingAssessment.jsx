import React, { useState, useRef } from 'react';
import axios from 'axios';
import './UploadFile.css'; // Import CSS file for styling
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'; // Import cross and plus icons
import Papa from 'papaparse'; // Import Papa Parse

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setFile(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            if (!file) {
                setUploadError("Please select a file.");
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const parsedData = await parseFile(file);

            const response = await axios.post('http://localhost:5000/admin/training-assessment', parsedData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Upload response:', response.data); // Log response from backend

            setUploadSuccess("File uploaded successfully.");
            setFile(null); // Clear file after successful upload
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadError("Error uploading file. Please try again.");
        }
    };

    const parseFile = async (file) => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    resolve(result.data);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    };

    const handleCancel = () => {
        setFile(null);
    };

    const handleClickPlusButton = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
                  <h1 className="title">Manage Training Scores</h1>
       
        <div
            className={`upload-container ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {file && (
                <div className="close-icon" onClick={handleCancel}>
                    <AiOutlineClose />
                </div>
            )}
            {uploadError && (
                <div className="error-message">
                    <p>{uploadError}</p>
                    <AiOutlineClose onClick={() => setUploadError(null)} />
                </div>
            )}
            {uploadSuccess && (
                <div className="success-message">
                    <p>{uploadSuccess}</p>
                    <AiOutlineClose onClick={() => setUploadSuccess(null)} />
                </div>
            )}
            <h2 className="upload-title">Upload Scores</h2>
            <div className="file-input-container">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                    accept=".csv"
                    ref={fileInputRef} // Add ref here
                />
                <AiOutlinePlus className="plus-icon" onClick={handleClickPlusButton} />
                <p className="upload-text">or drag and drop files here</p>
            </div>
            {file && (
                <div className="file-info">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
            )}
            <div className="button-container">
                <button onClick={handleUpload} className="upload-button">Upload</button>
            </div>
        </div>
        </div>
    );
};

export default UploadFile;
