import axios from 'axios';
import { useState } from 'react';

function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    if (name === 'image1') {
      setImage1(files[0]);
    } else if (name === 'image2') {
      setImage2(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(23, image1, image2);
    if (!image1 || !image2) {
      setError('Please upload both images.');
      return;
    }

    const formData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);

    console.log(32, formData);

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:4000/compare',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setSimilarity(response.data.similarity);
    } catch (error) {
      console.log(error);
      setError('There was an error comparing the images.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Comparison</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ marginRight: '10px' }}>Upload First Image:</label>
          <input
            type='file'
            name='image1'
            accept='image/*'
            onChange={handleImageUpload}
          />
        </div>
        <div>
          <label style={{ marginRight: '10px', marginTop: '5px' }}>
            Upload Second Image:
          </label>
          <input
            type='file'
            name='image2'
            accept='image/*'
            onChange={handleImageUpload}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type='submit' disabled={loading}>
            {loading ? 'Comparing...' : 'Compare Images'}
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {similarity !== null && (
        <div>
          <h3>Results:</h3>
          <p>
            Similarity:{' '}
            <span style={{ color: `${similarity >= 90 ? 'green' : 'red'}` }}>
              {similarity}%
            </span>
          </p>
          <p style={{ color: `${similarity >= 90 ? 'green' : 'red'}` }}>
            {similarity >= 90 ? 'Images are similar' : 'Images are not similar'}
          </p>
          {/* {diffImage && (
            <div>
              <h3>Difference Image:</h3>
              <img src={diffImage} alt='Difference' />
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}

export default App;
