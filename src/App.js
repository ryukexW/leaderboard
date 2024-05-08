import logo from './logo.svg';
import { useEffect, useState } from 'react'
import axios from 'axios'; // Import Axios
import _ from 'lodash';
import './App.css';

function App() {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    fetchCSVData();    // Fetch the CSV data when the component mounts
  }, []); // The empty array ensures that this effect runs only once, like componentDidMount

  const fetchCSVData = () => {
    const csvUrl = process.env.REACT_APP_SHEET_URL; // Replace with your Google Sheets CSV file URL

    axios.get(csvUrl)    // Use Axios to fetch the CSV data
        .then((response) => {
          const parsedCsvData = parseCSV(response.data);        // Parse the CSV data into an array of objects
            console.log(parsedCsvData);        // Now you can work with 'csvData' in your component's state.
          const sorted = _.orderBy(parsedCsvData, 'Point', 'desc');
            setCsvData(sorted);        // Set the fetched data in the component's state
        })
        .catch((error) => {
          console.error('Error fetching CSV data:', error);
        });
  }

  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/);        // Use a regular expression to split the CSV text into rows while handling '\r'
    const headers = rows[0].split(',');        // Extract headers (assumes the first row is the header row)
    const data = [];        // Initialize an array to store the parsed data
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');          // Use the regular expression to split the row while handling '\r'
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
        if (headers[j] === 'Point') {
          rowObject[headers[j]] = parseInt( rowData[j]);
        } else {
          rowObject[headers[j]] = rowData[j];
        }
      }

      if (!!rowObject.Name  && i !== rows.length - 1) {
        rowObject.Image = "/avatar/" + rowObject.Name.toLowerCase() + ".PNG";
        data.push(rowObject);
      }
    }

    return data;
  }

  return (
      <div className="container">
        <div className="topLeadersList">
          {csvData.map((leader, index) => (
              <div className="leader" key={leader.Name}>
                {index + 1 <= 3 && (
                    <div className="containerImage">
                      <img className="image" loading="lazy" src={leader.Image} />
                      <div className="crown">
                        <svg
                            id="crown1"
                            fill="#0f74b5"
                            data-name="Layer 1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 50"
                        >
                          <polygon
                              className="cls-1"
                              points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
                          />
                        </svg>
                      </div>
                      <div className="leaderName">{leader.Name}</div>
                    </div>
                )}
              </div>
          ))}
        </div>

        <div className="playerslist">
          <div className="table">
            <div>#</div>

            <div>Name</div>

            <div>Point</div>
          </div>
          <div className="list">
            {csvData.map((leader, index) => (
                <div className="player" key={leader.Name}>
                  <span> {index + 1}</span>
                  <div className="user">
                    <img className="image" src={leader.Image} />
                    <span> {leader.Name} </span>
                  </div>
                  <span> {leader.Point} </span>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export default App;
