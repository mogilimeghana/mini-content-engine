import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [jobs, setJobs] = useState([]);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load jobs when page opens
  useEffect(() => {
    fetchJobs();
  }, []);

  // Generate content
  const generateContent = async () => {
    if (!productName.trim() || !description.trim()) {
      alert("Please enter both Product Name and Product Description.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/generate", {
        productName,
        description,
      });

      const id = response.data.jobId;

      setJobId(id);
      setStatus(response.data.status);
      setImageUrl("");

      setProductName("");
      setDescription("");

      // Poll job status every 2 seconds
      const interval = setInterval(async () => {
        try {
          const jobResponse = await axios.get(
            `http://localhost:5000/jobs/${id}`
          );

          setStatus(jobResponse.data.status);

          if (jobResponse.data.status === "completed") {
            setImageUrl(jobResponse.data.imageUrl);
            fetchJobs(); // Refresh jobs list
            clearInterval(interval);
          }
        } catch (error) {
          console.error(error);
          clearInterval(interval);
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Mini Content Engine</h1>

        <label htmlFor="productName">Product Name</label>
        <input
          type="text"
          id="productName"
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <label htmlFor="description">Product Description</label>
        <textarea
          id="description"
          rows="5"
          placeholder="Enter product description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button onClick={generateContent}>Generate</button>

        <div className="result">
          <p>
            <strong>Job ID:</strong> {jobId}
          </p>

          <p>
            <strong>Status:</strong> {status}
          </p>

          <p>
            <strong>Generated Image:</strong>
          </p>

          {imageUrl && (
            <img
              src={`http://localhost:5000${imageUrl}`}
              alt="Generated"
              width="300"
              style={{ marginTop: "10px", borderRadius: "8px" }}
            />
          )}
        </div>

        <hr style={{ margin: "30px 0" }} />

        <h2>All Jobs</h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Prompt</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Image</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id.slice(0, 8)}...</td>
                  <td>{job.prompt}</td>
                  <td>{job.status}</td>
                  <td>{new Date(job.created_at).toLocaleString()}</td>
                  <td>
                    {job.image_url ? (
                      <a
                        href={`http://localhost:5000${job.image_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      "Not Ready"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;