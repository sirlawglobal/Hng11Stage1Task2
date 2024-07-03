const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Helper function to get the user's IP address
const getClientIp = (req) => {
  let clientIp  = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return clientIp;
};

app.get('/api/hello', async (req, res) => {

  const visitorName = req.query.visitor_name || 'Visitor';
  let clientIp = getClientIp(req);

    

      if (!clientIp || clientIp === '::1' || clientIp === '127.0.0.1') {
    clientIp = '8.8.8.8'; // Example IP address (Google Public DNS)
  }
  // console.log("this is an ip2")
  //   console.log(clientIp)

    try {
        // Use an IP Geolocation API to get the city
        const geoResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);

        const city = geoResponse.data.city;

        // Use a Weather API to get the temperature
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: process.env.OPENWEATHER_API_KEY,
                units: 'metric' // Change to 'imperial' for Fahrenheit
            }
        });

        const temperature = weatherResponse.data.main.temp;
        
        res.json({"message":`Hi, ${visitorName}. I  know this about you.  Your Ip Address is ${clientIp}. You are from ${city} and your ambient temperature is ${temperature} :)`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

















