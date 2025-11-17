# 🚗 Repair Cars Backend API

Uma API robusta desenvolvida em **Node.js + Express + Mongoose** para gerenciamento completo de uma oficina mecânica. Oferece funcionalidades para gestão de clientes, conversas, localização e pagamentos.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Endpoints](#-endpoints)
- [Modelos de Dados](#-modelos-de-dados)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Scripts Úteis](#-scripts-úteis)
- [Estrutura do Projeto](#-estrutura-do-projeto)

## 🚀 Funcionalidades

- **👥 Gestão de Contatos** - Cadastro completo de clientes e fornecedores
- **💬 Sistema de Conversas** - Mensagens em tempo real entre oficina e clientes
- **📍 Rastreamento de Localização** - Geolocalização para serviços móveis
- **💳 Processamento de Pagamentos** - Múltiplas formas de pagamento
- **📊 Dashboard Analytics** - Métricas e relatórios do negócio
- **🔐 Autenticação JWT** - Segurança robusta para a API
- **📱 CORS Configurado** - Pronto para integração com apps mobile

## 🛠 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação por tokens
- **CORS** - Cross-Origin Resource Sharing
- **bcryptjs** - Criptografia de senhas
- **dotenv** - Variáveis de ambiente

## 📥 Instalação

### Pré-requisitos
- Node.js 16+
- MongoDB 4.4+
- npm ou yarn

### Passo a passo

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd repair-cars-backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor
npm run dev
```

## ⚙ Configuração

### Arquivo `.env`
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/repaircars

# Segurança
JWT_SECRET=seu_jwt_super_secreto_aqui
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:3001
```

### Configuração do MongoDB
```bash
# Iniciar MongoDB (Linux/macOS)
sudo systemctl start mongod

# Ou iniciar manualmente
mongod --dbpath /caminho/para/dados
```

## 📡 Endpoints

### 🔍 Status da API
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/health` | Status da API e informações do servidor |

### 👥 Contatos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/contacts` | Listar todos os contatos |
| `GET` | `/api/contacts/:id` | Buscar contato por ID |
| `POST` | `/api/contacts` | Criar novo contato |
| `PUT` | `/api/contacts/:id` | Atualizar contato |
| `DELETE` | `/api/contacts/:id` | Excluir contato (soft delete) |

### 💬 Conversas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/conversations` | Listar conversas |
| `GET` | `/api/conversations/:id` | Buscar conversa específica |
| `POST` | `/api/conversations` | Iniciar nova conversa |
| `POST` | `/api/conversations/:id/messages` | Enviar mensagem |
| `GET` | `/api/conversations/contact/:contactId` | Conversas de um contato |

### 📍 Localizações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/locations` | Listar localizações |
| `POST` | `/api/locations` | Registrar localização |
| `GET` | `/api/locations/contact/:contactId` | Localizações de um contato |
| `GET` | `/api/locations/nearby` | Localizações próximas |

### 💳 Pagamentos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/payments` | Listar pagamentos |
| `POST` | `/api/payments` | Criar pagamento |
| `PUT` | `/api/payments/:id/status` | Atualizar status |
| `GET` | `/api/payments/contact/:contactId` | Pagamentos de um contato |

### 📊 Dashboard
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/dashboard/stats` | Estatísticas gerais |
| `GET` | `/api/dashboard/recent-activity` | Atividade recente |

## 🗃 Modelos de Dados

### Contact (Contato)
```javascript
{
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, lowercase: true },
  role: { 
    type: String, 
    enum: ['customer', 'supplier', 'mechanic', 'admin'],
    default: 'customer'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  notes: String,
  isActive: { type: Boolean, default: true }
}
```

### Conversation (Conversa)
```javascript
{
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact' 
  }],
  messages: [{
    sender: { type: String, required: true },
    content: { type: String, required: true },
    messageType: {
      type: String,
      enum: ['text', 'location', 'image', 'file'],
      default: 'text'
    },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  }],
  lastMessage: String,
  lastMessageTimestamp: Date
}
```

### Location (Localização)
```javascript
{
  contact: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact', 
    required: true 
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: String,
  accuracy: Number,
  timestamp: { type: Date, default: Date.now }
}
```

### Payment (Pagamento)
```javascript
{
  contact: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact', 
    required: true 
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'BRL' },
  method: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'pix', 'transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  description: String,
  dueDate: Date,
  paidAt: Date
}
```

## 💡 Exemplos de Uso

### Criar um contato
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "phone": "+5511999999999",
    "email": "joao@email.com",
    "role": "customer",
    "address": {
      "street": "Rua das Flores, 123",
      "city": "São Paulo",
      "state": "SP"
    }
  }'
```

### Enviar uma mensagem
```bash
curl -X POST http://localhost:3000/api/conversations/507f1f77bcf86cd799439011/messages \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "oficina",
    "content": "Seu carro está pronto para retirada!",
    "messageType": "text"
  }'
```

### Registrar localização
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "contact": "507f1f77bcf86cd799439011",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "address": "Av. Paulista, 1000"
  }'
```

## 🛠 Scripts Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia com nodemon (auto-reload)

# Produção
npm start           # Inicia servidor
npm run build       # Compila projeto (se necessário)

# Banco de Dados
npm run seed        # Popula banco com dados de exemplo
npm run clear-db    # Limpa dados de desenvolvimento

# Qualidade de Código
npm run lint        # Análise ESLint
npm run format      # Formata código com Prettier
```

## 📁 Estrutura do Projeto

```
repair-cars-backend/
├── models/                 # Modelos do Mongoose
│   ├── Contact.js
│   ├── Conversation.js
│   ├── Location.js
│   └── Payment.js
├── routes/                # Rotas da API
│   ├── contacts.js
│   ├── conversations.js
│   ├── locations.js
│   └── payments.js
├── middleware/            # Middlewares customizados
│   ├── auth.js
│   └── validation.js
├── controllers/           # Lógica de negócio
├── config/               # Configurações
│   └── database.js
├── scripts/              # Scripts utilitários
│   └── seedData.js
├── .env.example
├── package.json
└── server.js
```

## 🔄 Integração com App Mobile

### Configuração no Android:
```kotlin
// No ApiClient.kt
val BASE_URL = "http://10.0.2.2:3000/api/"  // Emulador
// ou
val BASE_URL = "http://192.168.1.100:3000/api/"  // Dispositivo físico
```

### Headers recomendados:
```http
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

## 🚨 Solução de Problemas

### Erros comuns:
- **MongoDB não conecta**: Verifique se o serviço está rodando
- **Porta ocupada**: Altere a `PORT` no `.env`
- **CORS errors**: Configure `CLIENT_URL` corretamente

### Logs de depuração:
```bash
# Verificar status do MongoDB
sudo systemctl status mongod

# Testar conexão com a API
curl http://localhost:3000/api/health
```

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs do servidor
2. Confirme se o MongoDB está rodando
3. Valide as configurações do `.env`
4. Consulte a documentação da API

---

**Desenvolvido com ❤️ para oficinas mecânicas**
