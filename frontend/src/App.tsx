import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Fetch images from backend
  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/images");
      setAllImages(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Select image handler
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setError("");
    }
  };

  // Upload handler
  const handleUpload = async () => {
    if (!image) {
      setError("⚠️ Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);

      // Refresh images after upload
      fetchImages();

      // Reset selected image
      setImage(null);
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      console.error("❌ Upload error:", err.message);
      setError("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="upload-card">
        <h1>Image Upload & Preview</h1>

        {/* File Input */}
        <input type="file" accept="image/*" onChange={handleImageSelect} />

        {/* Preview */}
        {image && (
          <div className="preview-container">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="preview-img"
            />
          </div>
        )}

        {/* Error Message */}
        {error && <p className="error-msg">{error}</p>}

        {/* Upload Button */}
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {/* Gallery */}
      <div className="gallery">
        {loading ? (
          <p>Loading images...</p>
        ) : allImages.length > 0 ? (
          allImages.map((img) => (
            <div className="gallery-item" key={img._id}>
              <img
                src={`http://localhost:5001/uploads/${img.path}`}
                alt={img.name}
                className="gallery-img"
              />
              <p>{img.name}</p>
            </div>
          ))
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
