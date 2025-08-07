# GrannyGPT 🌴

A beautiful, modern web interface for GrannyGPT - your wise Caribbean grandmother AI that speaks authentic Creole and shares cultural wisdom, stories, and advice.

![GrannyGPT Interface](static/logo.png)

## ✨ Features

- **Authentic Caribbean Creole AI** - Trained on 6,000 Caribbean Creole conversations
- **Beautiful Modern Interface** - Warm, retro-inspired design with smooth animations
- **Light & Dark Mode** - Toggle between themes with smooth transitions
- **Smart Conversation Management** - Create, switch, and delete chat sessions
- **Configurable Memory** - Adjust conversation history limit (10-50 messages)
- **Streaming Responses** - Real-time AI responses with typing indicators
- **Responsive Design** - Works perfectly on desktop and mobile
- **Production Ready** - Professional, polished interface

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ (LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RolexAlexander/GrannyGPT.git
   cd GrannyGPT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   VITE_API_URL=https://your_hosted_version_of_model_url
   VITE_MODEL_NAME=hf.co/RolexAlexander/GrannyGPT-3.2-Carib:F16
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Your hosted model API endpoint | `https://783a513db26e.ngrok-free.app/api/chat` |
| `VITE_MODEL_NAME` | HuggingFace model identifier | `hf.co/RolexAlexander/GrannyGPT-3.2-Carib:F16` |

### Chat Settings

- **Conversation Memory**: Adjustable from 10-50 messages in settings
- **Theme**: Light/Dark mode toggle in hamburger menu
- **Auto-scroll**: Automatic scrolling to latest messages
- **Message Fade**: Older messages fade for better focus

## 🎨 Interface Features

### Design Elements
- **Warm Color Palette**: Caribbean-inspired orange and green gradients
- **Glassmorphism Effects**: Modern translucent UI elements
- **Smooth Animations**: Floating elements and transitions
- **Responsive Layout**: Works on all medium and large screen sizes

### Chat Features
- **Smart Message History**: System maintains conversation context
- **Typing Indicators**: Shows when GrannyGPT is responding
- **Message Timestamps**: Track conversation timing
- **Chat Management**: Create, switch, and delete conversations
- **Streaming Responses**: Real-time message display

## 🤖 AI Model Information

GrannyGPT is powered by a fine-tuned language model trained specifically on Caribbean Creole conversations.

- **Model**: [GrannyGPT-3.2-Carib](https://huggingface.co/RolexAlexander/GrannyGPT-3.2-Carib)
- **Training Dataset**: [6K Caribbean Creole Conversations](https://www.kaggle.com/datasets/rolexalexander/grannygpt-6k-caribbean-creole-conversations)
- **Language**: Authentic Caribbean Creole
- **Personality**: Warm, wise Caribbean grandmother
- **Specialties**: Cultural wisdom, cooking advice, life stories, traditional knowledge

## 🛠️ Tech Stack

- **Frontend**: SvelteKit 
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Language**: JavaScript
- **State Management**: Svelte Stores
- **API**: Streaming JSON response handling

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run check        # Type checking
npm run lint         # ESLint
npm run format       # Prettier formatting
```

### Project Structure

```
GrannyGPT/
├── src/
│   ├── lib/
│   │   └── stores/
│   │       └── chat.js         # Chat state management & API calls
│   ├── routes/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── +server.js  # Streaming API endpoint handler
│   │   └── +page.svelte        # Main application interface
│   ├── app.css                 # Global styles & Tailwind imports
│   └── app.html                # HTML template
├── static/                     # Static assets (logo.png)
├── tailwind.config.js          # Tailwind CSS configuration
├── .env.example               # Environment variables template
└── package.json               # Project dependencies
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The app is ready for deployment on any SvelteKit-compatible platform:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Connect repo or deploy build folder
- **Railway**: Deploy with Node.js preset
- **Self-hosted**: Use SvelteKit Node adapter

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **🏠 Repository**: [GitHub](https://github.com/RolexAlexander/GrannyGPT.git)
- **🤗 Model**: [HuggingFace](https://huggingface.co/RolexAlexander/GrannyGPT-3.2-Carib)
- **📊 Dataset**: [Kaggle](https://www.kaggle.com/datasets/rolexalexander/grannygpt-6k-caribbean-creole-conversations)

## 📞 Support

If you have questions or need help:

- Check existing [Issues](https://github.com/RolexAlexander/GrannyGPT/issues)
- Create a new issue with detailed information
- Review the configuration section above

---

**Made with ❤️ for the Caribbean community**

*"Code wid purpose, not just code fi code."* - GrannyGPT
