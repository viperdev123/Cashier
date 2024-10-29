const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Import cors
const { google } = require("googleapis"); // Ensure googleapis is imported
const app = express();
const PORT = 3000;

// Load client secrets from a local file.
const credentials = require("../JSON-For-Cashier/client_secret_34795914157-3svhe8e5qhkepd9eqncti56v81l81hk7.apps.googleusercontent.com.json"); // Update with your credentials file path

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.use(express.json()); // Enable JSON body parsing
// Set up OAuth2 client
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

(async () => {
  const open = (await import("open")).default; // Use dynamic import for ES Module

  // Generate a URL for the user to authorize the application
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  console.log("Authorize this app by visiting this url:", authUrl);

  // Open the URL in the default browser
  open(authUrl);
})();

// Endpoint to handle the OAuth 2.0 callback
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
    res.send("Authentication successful! You can close this tab.");
  } catch (error) {
    console.error("Error retrieving access token", error);
    res.send("Error during authentication");
  }
});

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

// Helper function to append data to a specified tab
async function appendOrderToTab(tabName, orderData) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const request = {
      spreadsheetId: "1lxwIXRhZGW7-OJ7b5naD3jV83FgEoaNfNuYtFhgsFT0",
      range: `${tabName}!A:D`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [orderData],
      },
    };

    const response = await sheets.spreadsheets.values.append(request);
    return response.data;
  } catch (error) {
    console.error(`Error appending data to ${tabName} tab:`, error);
    throw error;
  }
}

// Ensure this function is defined and used correctly
async function appendOrderToSoda(orderData) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const request = {
      spreadsheetId: "1lxwIXRhZGW7-OJ7b5naD3jV83FgEoaNfNuYtFhgsFT0",
      range: "Soda!A:D",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [orderData],
      },
    };

    const response = await sheets.spreadsheets.values.append(request);
    return response.data;
  } catch (error) {
    console.error("Error appending data to Soda tab:", error);
    throw error;
  }
}

// Endpoint to post new order data to the Soda tab
app.post("/add-order/soda", async (req, res) => {
  const { OrderID, OrderName, TotalPrice, TotalCups } = req.body;

  if (!OrderID || !OrderName || !TotalPrice || !TotalCups) {
    return res.status(400).json({ message: "Missing required order data" });
  }

  try {
    const orderData = [OrderID, OrderName, TotalPrice, TotalCups];
    await appendOrderToSoda(orderData);
    res.status(201).json({ message: "Order added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding order to Soda tab" });
  }
});

// Endpoint to get the latest OrderID from the Soda tab
app.get("/latest-order-id/soda", async (req, res) => {
  try {
    const latestOrderID = await getLatestOrderID("Soda");
    if (latestOrderID) {
      res.json({ latestOrderID });
    } else {
      res.status(404).json({ message: "No order data available in Soda tab." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching OrderID from Soda tab" });
  }
});

// Endpoint to get the latest OrderID from the Tea tab
app.get("/latest-order-id/tea", async (req, res) => {
  try {
    const latestOrderID = await getLatestOrderID("Tea");
    if (latestOrderID) {
      res.json({ latestOrderID });
    } else {
      res.status(404).json({ message: "No order data available in Tea tab." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching OrderID from Tea tab" });
  }
});

// Endpoint to get the latest OrderID from the Dessert tab
app.get("/latest-order-id/dessert", async (req, res) => {
  try {
    const latestOrderID = await getLatestOrderID("Dessert");
    if (latestOrderID) {
      res.json({ latestOrderID });
    } else {
      res
        .status(404)
        .json({ message: "No order data available in Dessert tab." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching OrderID from Dessert tab" });
  }
});

// Endpoint to post new order data to the Tea tab
app.post("/add-order/tea", async (req, res) => {
  const { OrderID, OrderName, TotalPrice, TotalCups } = req.body;

  if (!OrderID || !OrderName || !TotalPrice || !TotalCups) {
    return res.status(400).json({ message: "Missing required order data" });
  }

  try {
    const orderData = [OrderID, OrderName, TotalPrice, TotalCups];
    await appendOrderToTab("Tea", orderData);
    res.status(201).json({ message: "Order added successfully to Tea tab" });
  } catch (error) {
    res.status(500).json({ message: "Error adding order to Tea tab" });
  }
});

// Endpoint to post new order data to the Dessert tab
app.post("/add-order/dessert", async (req, res) => {
  const { OrderID, OrderName, TotalPrice, TotalCups } = req.body;

  if (!OrderID || !OrderName || !TotalPrice || !TotalCups) {
    return res.status(400).json({ message: "Missing required order data" });
  }

  try {
    const orderData = [OrderID, OrderName, TotalPrice, TotalCups];
    await appendOrderToTab("Dessert", orderData);
    res
      .status(201)
      .json({ message: "Order added successfully to Dessert tab" });
  } catch (error) {
    res.status(500).json({ message: "Error adding order to Dessert tab" });
  }
});

// Helper function to fetch the latest DetailID from a specific sheet tab
async function getLatestDetailID(sheetTabName) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "12Aeg4-g0Aw3eXLSQAxKl4kvedwqlO11LrPx1cykc4w4",
      range: `${sheetTabName}!A1:A1000`, // Assuming DetailID is in column A
    });

    const data = response.data.values;
    console.log(`Data fetched from ${sheetTabName}:`, data);

    if (data && data.length > 1) {
      const latestDetailRow = data[data.length - 1]; // Get the last row of data
      const latestDetailID = latestDetailRow[0]; // DetailID is in the first column
      return latestDetailID;
    } else {
      console.log(`No data found in ${sheetTabName} or only header present.`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching DetailID from ${sheetTabName} tab:`, error);
    throw error;
  }
}

// Endpoint to get the latest DetailID from the OrderDetailSoda tab
app.get("/latest-detail-id/soda", async (req, res) => {
  try {
    const latestDetailID = await getLatestDetailID("OrderDetailSoda");
    if (latestDetailID) {
      res.json({ latestDetailID });
    } else {
      res
        .status(404)
        .json({ message: "No detail data available in OrderDetailSoda tab." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching DetailID from OrderDetailSoda tab" });
  }
});

// Endpoint to get the latest DetailID from the OrderDetailTea tab
app.get("/latest-detail-id/tea", async (req, res) => {
  try {
    const latestDetailID = await getLatestDetailID("OrderDetailTea");
    if (latestDetailID) {
      res.json({ latestDetailID });
    } else {
      res
        .status(404)
        .json({ message: "No detail data available in OrderDetailTea tab." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching DetailID from OrderDetailTea tab" });
  }
});

// Endpoint to get the latest DetailID from the OrderDetailDessert tab
app.get("/latest-detail-id/dessert", async (req, res) => {
  try {
    const latestDetailID = await getLatestDetailID("OrderDetailDessert");
    if (latestDetailID) {
      res.json({ latestDetailID });
    } else {
      res
        .status(404)
        .json({
          message: "No detail data available in OrderDetailDessert tab.",
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching DetailID from OrderDetailDessert tab" });
  }
});

// Helper function to append order details to a specified tab
async function appendOrderDetailToTab(tabName, detailData) {
  try {
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    const request = {
      spreadsheetId: "12Aeg4-g0Aw3eXLSQAxKl4kvedwqlO11LrPx1cykc4w4",
      range: `${tabName}!A:E`, // Assuming columns A to E are used
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [detailData],
      },
    };

    const response = await sheets.spreadsheets.values.append(request);
    return response.data;
  } catch (error) {
    console.error(`Error appending data to ${tabName} tab:`, error);
    throw error;
  }
}

// Endpoint to post new order detail data to the OrderDetailSoda tab
app.post("/add-order-detail/soda", async (req, res) => {
  const { DetailId, OrderId, ProductName, Quantity, PricePerCup } = req.body;

  if (!DetailId || !OrderId || !ProductName || !Quantity || !PricePerCup) {
    return res
      .status(400)
      .json({ message: "Missing required order detail data" });
  }

  try {
    const detailData = [DetailId, OrderId, ProductName, Quantity, PricePerCup];
    await appendOrderDetailToTab("OrderDetailSoda", detailData);
    res
      .status(201)
      .json({ message: "Order detail added successfully to Soda tab" });
  } catch (error) {
    res.status(500).json({ message: "Error adding order detail to Soda tab" });
  }
});

// Endpoint to post new order detail data to the OrderDetailTea tab
app.post("/add-order-detail/tea", async (req, res) => {
  const { DetailId, OrderId, ProductName, Quantity, PricePerCup } = req.body;

  if (!DetailId || !OrderId || !ProductName || !Quantity || !PricePerCup) {
    return res
      .status(400)
      .json({ message: "Missing required order detail data" });
  }

  try {
    const detailData = [DetailId, OrderId, ProductName, Quantity, PricePerCup];
    await appendOrderDetailToTab("OrderDetailTea", detailData);
    res
      .status(201)
      .json({ message: "Order detail added successfully to Tea tab" });
  } catch (error) {
    res.status(500).json({ message: "Error adding order detail to Tea tab" });
  }
});

// Endpoint to post new order detail data to the OrderDetailDessert tab
app.post("/add-order-detail/dessert", async (req, res) => {
  const { DetailId, OrderId, ProductName, Quantity, PricePerCup } = req.body;

  if (!DetailId || !OrderId || !ProductName || !Quantity || !PricePerCup) {
    return res
      .status(400)
      .json({ message: "Missing required order detail data" });
  }

  try {
    const detailData = [DetailId, OrderId, ProductName, Quantity, PricePerCup];
    await appendOrderDetailToTab("OrderDetailDessert", detailData);
    res
      .status(201)
      .json({ message: "Order detail added successfully to Dessert tab" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding order detail to Dessert tab" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
