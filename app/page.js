import { useState } from 'react';

export default function Home() {
  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState(null);
  const [filter, setFilter] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const parsedData = JSON.parse(jsonData);
      const res = await fetch('https://your-heroku-app.herokuapp.com/bfhl', { // Replace with your backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsedData.data })
      });
      const result = await res.json();
      setResponse(result);
    } catch (err) {
      alert('Invalid JSON input');
    }
  };

  const handleFilter = (e) => {
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
        />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div>
          <h3>Filter Options</h3>
          <label>
            <input type="checkbox" value="alphabets" onChange={handleFilter} />
            Alphabets
          </label>
          <label>
            <input type="checkbox" value="numbers" onChange={handleFilter} />
            Numbers
          </label>
          <label>
            <input type="checkbox" value="highest_alphabet" onChange={handleFilter} />
            Highest Alphabet
          </label>

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
