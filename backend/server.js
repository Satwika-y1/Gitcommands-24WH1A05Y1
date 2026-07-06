const http = require('http');
const PORT = 3000;
const participants = [];

const server = http.createServer((req, res) => {
    // Enable CORS headers for cross-origin frontend communication
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle Preflight request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Process Registration Form Route
    if (req.url === '/register' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => { 
            body += chunk.toString(); 
        });
        
        req.on('end', () => {
            try {
                // Parse the complete payload sent from the updated frontend form
                const { name, email, phone, ticketType, diet } = JSON.parse(body);
                
                if (!name || !email || !phone) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Required fields are missing." }));
                }

                // Store all detailed fields in our memory microservice store
                const newParticipant = { name, email, phone, ticketType, diet, timestamp: new Date() };
                participants.push(newParticipant);
                
                // Clear visibility tracking logs in your DevOps terminal
                console.log(`\n==========================================`);
                console.log(`[MICROSERVICE SUCCESS] New Event Registration!`);
                console.log(`Name:   ${name}`);
                console.log(`Email:  ${email}`);
                console.log(`Phone:  ${phone}`);
                console.log(`Ticket: ${ticketType.toUpperCase()}`);
                console.log(`Diet:   ${diet}`);
                console.log(`==========================================`);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Registration successful! Welcome to the Summit." }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Invalid JSON format payload structure." }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Endpoint Resource Not Found" }));
    }
});

server.listen(PORT, () => {
    console.log(`Detailed Registration Server running smoothly on port ${PORT}`);
});