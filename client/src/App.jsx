import axios from 'axios';
import { useState } from 'react';

// const BASE_URL = 'http://localhost:4000';
// const BASE_URL = 'https://image-comparison-umwv.onrender.com';
const BASE_URL = 'http://127.0.0.1:8000';

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
    if (!image1 || !image2) {
      setError('Please upload both images.');
      setSimilarity(null);
      return;
    }

    const formData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/compare`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      setSimilarity(response.data);
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
          {loading && (
            <p>
              The app is hosted on the free tier of Render, so there may be a
              slight delay in response.
            </p>
          )}
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {similarity && (
        <div>
          <h3>Results:</h3>
          <p>
            ORB Similarity:{' '}
            <span
              style={{
                color: `${similarity.orb_similarity >= 90 ? 'green' : 'red'}`,
              }}
            >
              {similarity.orb_similarity}%
            </span>
          </p>
          <p
            style={{
              color: `${similarity.orb_similarity >= 90 ? 'green' : 'red'}`,
            }}
          >
            {similarity.orb_similarity >= 90
              ? 'Images are similar'
              : 'Images are not similar because it could not pass the ORB similarity threshold which is 90%'}
          </p>
          <p>
            Structural Similarity:{' '}
            <span
              style={{
                color: `${similarity.ssim_similarity >= 90 ? 'green' : 'red'}`,
              }}
            >
              {similarity.ssim_similarity}%
            </span>
          </p>
          <p
            style={{
              color: `${similarity.ssim_similarity >= 90 ? 'green' : 'red'}`,
            }}
          >
            {similarity.ssim_similarity >= 90
              ? 'Images are similar'
              : 'Images are not similar because it could not pass the structural similarity threshold which is 90%'}
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
