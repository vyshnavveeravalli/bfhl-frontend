import { useState } from 'react';

export default function Home() {
  const [jsonData, setJsonData] = useState('');   // To store JSON input from the user
  const [response, setResponse] = useState(null); // To store the backend response
  const [filter, setFilter] = useState([]);       // To store the selected filter (Alphabets, Numbers, Highest Alphabet)
  const [error, setError] = useState('');         // To handle and display validation errors

  const backendUrl = 'https://bfhl-backend-mj07.onrender.com/bfhl'; // Replace with your deployed backend URL

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate if the JSON input is valid
    try {
      const parsedData = JSON.parse(jsonData); // Parse the input JSON
      if (!parsedData.data) throw new Error("Invalid JSON format. Please include a 'data' key.");
      
      // Make POST request to the backend
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsedData.data }),
      });

      const result = await res.json(); // Get the response from the backend
      setResponse(result);             // Store the response
    } catch (err) {
      setError('Invalid JSON input. Please check your format.');
    }
  };

  // Function to handle the filter selection
  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (filter.includes(value)) {
      setFilter(filter.filter(f => f !== value));
    } else {
      setFilter([...filter, value]);
    }
  };

  return (
    <div>
      <h1>{response ? response.roll_number : "Frontend Application"}</h1>

      <form onSubmit={handleSubmit}>
        <label>Input JSON:</label>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          rows={4}
          placeholder={`Example: { "data": ["A", "C", "z", "1", "3"] }`}
        />
        <button type="submit">Submit</button>
      </form>

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* If we have a response from the backend */}
      {response && (
        <div>
          <h3>Filter Options</h3>
          <label>
            <input
              type="checkbox"
              value="alphabets"
              onChange={handleFilterChange}
            />
            Alphabets
          </label>
          <label>
            <input
              type="checkbox"
              value="numbers"
              onChange={handleFilterChange}
            />
            Numbers
          </label>
          <label>
            <input
              type="checkbox"
              value="highest_alphabet"
              onChange={handleFilterChange}
            />
            Highest Alphabet
          </label>

          {/* Display the filtered response */}
          <h3>Response:</h3>
          <pre>
            {JSON.stringify({
              alphabets: filter.includes('alphabets') ? response.alphabets : undefined,
              numbers: filter.includes('numbers') ? response.numbers : undefined,
              highest_alphabet: filter.includes('highest_alphabet') ? response.highest_alphabet : undefined,
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
