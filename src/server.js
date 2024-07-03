const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
const cors = require('cors');

// Use the cors middleware
app.use(cors());
app.set('trust proxy', true);

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const IPIFY_API_KEY = process.env.IPIFY_API_KEY;

app.get('/api/hello', async (req, res) => {
  console.log(req.ip)
  const visitorName = req.query.visitor_name || 'Visitor';

  // Extracting client IP
  // let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // Handling multiple IPs or IPv6 formats

  // if (clientIp && clientIp.includes(',')) {
  //   clientIp = clientIp.split(',')[0];
  // }

  // if (clientIp && clientIp.includes(':')) {
  //   const ipv6Segments = clientIp.split(':');
  //   clientIp = ipv6Segments[ipv6Segments.length - 1];
  // }

  // Use a fallback IP for local development
  // if (clientIp === '::1' || clientIp === '127.0.0.1' || !clientIp) {
  //   clientIp = '8.8.8.8'; // Google Public DNS IP as fallback
  // }

  let clientIp = req.ip;
  
  // console.log('Client IP:', clientIp);

  // console.log(req.ip)

  try {
    const locationResponse = await axios.get(`https://geo.ipify.org/api/v1?apiKey=${IPIFY_API_KEY}&ipAddress=${clientIp}`);
    console.log('Location Response:', locationResponse.data);

    const { city } = locationResponse.data.location;

    if (!city) {
      return res.status(400).json({ error: 'City not found for the given IP address' });
    }

    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`);
    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}`
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// const express = require('express');
// const axios = require('axios');
// const app = express();
// require('dotenv').config();
// const cors = require('cors');

// // Use the cors middleware
// app.use(cors());
// app.set('trust proxy', true);

// // const OPENWEATHER_API_KEY = "92761e2b9d95a244e834ca63858c1e12";

// // const IPIFY_API_KEY = "at_DMF2M80RJXe83Y4vMv5eonvaCV0LF";

// const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// const IPIFY_API_KEY = process.env.IPIFY_API_KEY;

// // const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
// // const IPIFY_API_KEY = process.env.IPIFY_API_KEY;

// app.get('/api/hello', async (req, res) => {
//   const visitorName = req.query.visitor_name || 'Visitor';

//   let clientIp = req.ip
  


//   console.log('Client IP:', clientIp);

//   try {
//     const locationResponse = await axios.get(`https://geo.ipify.org/api/v1?apiKey=${IPIFY_API_KEY}&ipAddress=${clientIp}`);
//     console.log('Location Response:', locationResponse.data);

//     const { city } = locationResponse.data.location;

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


