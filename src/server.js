const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
const cors = require('cors');



// Use the cors middleware
app.use(cors());


// const WHOISXML_API_KEY = "at_DMF2M80RJXe83Y4vMv5eonvaCV0LF";

 const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const IPIFY_API_KEY = process.env.IPIFY_API_KEY;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 
  'Visitor';
  
  let clientIp = req.ip;

console.log(clientIp)
  console.log('IPIFY_API_KEY:', process.env.IPIFY_API_KEY);
  console.log('OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY);


  try {
    const locationResponse = await axios.get(`https://geo.ipify.org/api/v1?apiKey=${IPIFY_API_KEY}&ipAddress=${clientIp}`);

    const { city } = locationResponse.data.location;

    if (!city) {
      return res.status(400).json({ error: 'City not found for the given IP address' });
    }

    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`);
    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// const express = require('express');
// const app = express();
// const port = 8000;

// app.get('/api/hello', (req, res) => {
//   const visitorName = req.query.visitor_name;
//   if (!visitorName) {
//     return res.status(400).send('Visitor name is required');
//   }
//   res.send(`Hello, ${visitorName}!`);
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
