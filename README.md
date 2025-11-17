# Oficina API

API simples em Node.js + Express + Mongoose para gerenciar contatos, conversas, localização e pagamentos para um app de oficina mecânica.

Instalação

1. Copie `.env.example` para `.env` e ajuste `MONGO_URI`.
2. npm install
3. npm run dev (requer nodemon) ou npm start

Endpoints principais

- GET / -> status
- Contacts: /api/contacts
- Conversations: /api/conversations
- Locations: /api/locations
- Payments: /api/payments

Modelos

- Contact: name, phone, email, role, notes
- Conversation: participants (Contact refs), messages
- Location: contact, lat, lng, address
- Payment: contact, amount, currency, method, status
