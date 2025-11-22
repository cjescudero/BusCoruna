const axios = require('axios');

async function checkApi() {
    try {
        const response = await axios.get('https://itranvias.com/queryitr_v3.php?&func=0&dato=42');
        const data = response.data;

        if (data.buses && data.buses.lineas) {
            const lines = data.buses.lineas.map(l => l.linea);
            console.log('Lines with arrivals at stop 42:', lines);
        }
    } catch (error) {
        console.error(error);
    }
}

checkApi();
