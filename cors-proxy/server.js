const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json()); // Enable JSON body parsing



// Helper function to fetch the latest OrderID from a specific sheet tab
async function getLatestOrderID(sheetTabName) {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/1lxwIXRhZGW7-OJ7b5naD3jV83FgEoaNfNuYtFhgsFT0/values/${sheetTabName}!A1:Z1000?key=AIzaSyCxoYDs3MtxkZfqFgwPZLS5qn7Z0NQK57Q`
    );

    const data = response.data.values;
    if (data && data.length > 1) {
      const latestOrderRow = data[data.length - 1]; // Get the last row of data
      const latestOrderID = latestOrderRow[0]; // OrderID is in the first column
      return latestOrderID;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching OrderID from ${sheetTabName} tab:`, error);
    throw error;
  }
}



// Endpoint to get the latest OrderID from the Soda tab
app.get('/latest-order-id/soda', async (req, res) => {
  try {
    const latestOrderID = await getLatestOrderID('Soda');
    if (latestOrderID) {
      res.json({ latestOrderID });
    } else {
      res.status(404).json({ message: 'No order data available in Soda tab.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching OrderID from Soda tab' });
  }
});


// Endpoint to get the latest OrderID from the Tea tab
app.get('/latest-order-id/tea', async (req, res) => {
  try {
    const latestOrderID = await getLatestOrderID('Tea');
    if (latestOrderID) {
      res.json({ latestOrderID });
    } else {
      res.status(404).json({ message: 'No order data available in Tea tab.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching OrderID from Tea tab' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
