import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/numbers"; // Backend API URL
const TOKEN = "YOUR_ACCESS_TOKEN"; // Replace with your token securely

interface ApiResponse {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
}

const AverageCalculator: React.FC = () => {
  const [numberType, setNumberType] = useState<string>("p");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchNumbers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ApiResponse>(`${API_URL}/${numberType}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      setData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Average Calculator Microservice</h2>
      <div>
        <label>Select Number Type: </label>
        <select value={numberType} onChange={(e) => setNumberType(e.target.value)}>
          <option value="p">Prime</option>
          <option value="f">Fibonacci</option>
          <option value="e">Even</option>
          <option value="r">Random</option>
        </select>
        <button onClick={fetchNumbers} disabled={loading}>
          {loading ? "Fetching..." : "Get Numbers"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div>
          <h3>Response</h3>
          <p><strong>Previous State:</strong> {JSON.stringify(data.windowPrevState)}</p>
          <p><strong>Current State:</strong> {JSON.stringify(data.windowCurrState)}</p>
          <p><strong>Fetched Numbers:</strong> {JSON.stringify(data.numbers)}</p>
          <p><strong>Average:</strong> {data.avg}</p>
        </div>
      )}
    </div>
  );
};

export default AverageCalculator;
