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

    console.log("this is an ip")
    console.log(clientIp)

      if (!clientIp || clientIp === '::1' || clientIp === '127.0.0.1') {
    clientIp = '8.8.8.8'; // Example IP address (Google Public DNS)
  }
  console.log("this is an ip2")
    console.log(clientIp)

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
        
        res.json({
          my_Ip_address: clientIp,
            city: city,
            temperature: temperature,
            myName: visitorName
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



















// const express = require('express');
// const axios = require('axios');
// const realip = require('req-real-ip');
// const app = express();
// require('dotenv').config();
// const cors = require('cors');
// const geoip = require('geoip-lite');

// // Use the cors middleware
// app.use(cors());
// app.use(express.json());
// app.set('trust proxy', true);

// // Middleware to detect real IP
// // app.use((req, res, next) => {
// //   req.realIp = realip.detect({ req: req, config: { cloudflare: false } });
// //   next();
// // });

// const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
// const IPIFY_API_KEY = process.env.IPIFY_API_KEY;

// app.get('/api/hello', async (req, res) => {
//   const visitorName = req.query.visitor_name || 'Visitor';

//   // let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
//   // clientIp = clientIp.split(',')[0].trim();

//   let clientIp = req.headers["cf-connecting-ip"] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.headers['x-real-ip'] || req.socket.remoteAddress


//   // let clientIp = req.realIp;

//   // Fallback IP for local testing

//   // if (!clientIp || clientIp === '::1' || clientIp === '127.0.0.1') {
//   //   clientIp = '8.8.8.8'; // Example IP address (Google Public DNS)
//   // }


//   console.log('Client IP:', clientIp); // Log client IP address
  

//   // http://ip-api.com/json/${ip}?fields=city

//   try {
//     // const locationResponse = await axios.get(`https://geo.ipify.org/api/v1?apiKey=${IPIFY_API_KEY}&ipAddress=${clientIp}`);

//     const geo = geoip.lookup(clientIp);
//     console.log('GEo:', geo); // Log client IP address

//     let city;
//   if (geo) {
//     city = `${geo.city}`;
// }
    


//     if (!city) {
//       return res.status(400).json({ error: 'City not found for the given IP address' });
//     }

//     const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`);
//     const temperature = weatherResponse.data.main.temp;

//     res.json({
//       client_ip: clientIp,
//       location: city,
//       greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}`
//     });
//   } catch (error) {
//     console.error('Error:', error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

