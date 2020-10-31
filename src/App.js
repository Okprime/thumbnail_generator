import React, { useRef, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const imageRef = useRef();
  const [data, setData] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ data, message }) => {
        setData(data);
      });
  }, []);

  const uploadImage = (e) => {
    e.preventDefault();

    setUploading(true);

    const formData = new FormData();
    formData.append('image', imageRef.current.files[0]);

    fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(({ data, message }) => {
        console.log('Data:: ', data);

        if (data && data.original) {
          setData((d) => [data, ...d]);
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <form
          onSubmit={(e) => uploadImage(e)}
          style={{
            marginBottom: 20,
          }}
        >
          <input
            type="file"
            name="image"
            accept=".png, .jpg, .jpeg"
            ref={imageRef}
          />
          <button type="submit">Upload</button>
          {uploading && (
            <div>
              <span style={{ fontSize: '10px' }}>Uploading file . . .</span>
            </div>
          )}
        </form>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {data.map(({ original, thumbnail }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 10,
                width: 300,
              }}
            >
              <img
                src={original}
                alt="original"
                style={{
                  maxWidth: 300,
                  maxHeight: 200,
                }}
              />
              <img
                src={thumbnail}
                alt="thumbnail"
                style={{
                  maxWidth: 60,
                  maxHeight: 40,
                  marginTop: 10,
                }}
              />
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
