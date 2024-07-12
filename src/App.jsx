import { useState } from "react";
import { readExcel, generateSQL } from "./utils";

function App() {
  const [file, setFile] = useState(null);
  const [customQuery, setCustomQuery] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleQueryChange = (e) => {
    setCustomQuery(e.target.value);
  };

  const handleGenerateSQL = async () => {
    if (file && customQuery) {
      try {
        const data = await readExcel(file);
        const sql = generateSQL(data, customQuery);
        setOutput(sql);
        setCopied(false);
      } catch (error) {
        console.error("Error reading Excel file:", error);
        setOutput("Error reading Excel file.");
      }
    } else {
      alert("Please select a file and provide a custom SQL query.");
    }
  };
  const handleCopyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  return (
    <>
      <h1>Excel to SQL</h1>
      <p>
        Provide a custom SQL query with placeholders for column names. Use{" "}
        <code>{"{column_name}"}</code> for column placeholders and{" "}
        <code>{"{rowIndex}"}</code> for the row index starting from 0.
      </p>
      <p>
        Example:{" "}
        <code>
          INSERT INTO mCore_data (index, Id, Code, Date) VALUES ({"{rowIndex}"},{" "}
          {"{id}"}, {"{code}"}, {"{date}"});
        </code>
      </p>
      <input type="file" onChange={handleFileChange} />
      <textarea
        placeholder="Enter custom SQL query (use {column_name} for placeholders)"
        value={customQuery}
        onChange={handleQueryChange}
      ></textarea>
      {output ? (
        <>
          <button className="copy-button" onClick={handleCopyToClipboard}>
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
          <div className="output">
            <dev className="output-text">{output}</dev>
          </div>
        </>
      ):(
        <button onClick={handleGenerateSQL}>Generate SQL</button>
      )}
       <div className="footer">
        © 2024 <a href="https://github.com/kythonlk" target="_blank" rel="noopener noreferrer">kythonlk</a>
      </div>
    </>
  );
}

export default App;