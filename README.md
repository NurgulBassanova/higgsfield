# Higgsfield Lecture Generator

A full-stack application for generating AI-powered lecture presentations using Qwen LLM and Higgsfield image generation.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python
- **AI Services**: 
  - Qwen LLM for text generation
  - Higgsfield for image generation

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
# Double-click start.bat or run:
start.bat
```

**For Linux/Mac:**
```bash
# Make executable and run:
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd higgsfield
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

2. **Start the backend:**
   ```bash
   cd higgsfield
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `higgsfield` directory:

```env
HF_API_KEY=your_higgsfield_api_key
HF_SECRET=your_higgsfield_secret
DASHSCOPE_API_KEY=your_dashscope_api_key
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

### API Keys Setup

1. **Higgsfield API**: Get your API key from [Higgsfield Platform](https://platform.higgsfield.ai/)
2. **Dashscope API**: Get your API key from [Alibaba Cloud Dashscope](https://dashscope.aliyun.com/)

## 📡 API Endpoints

### Lecture Generation
- `POST /lecture/generate-lecture` - Generate complete lecture
- `GET /lecture/{topic}` - Get lecture by topic

### Text Generation
- `POST /generate-text` - Generate text from prompt
- `POST /lecture/generate-text` - Generate text for lecture

### Image Generation
- `POST /generate-image` - Generate images from text
- `POST /generate-image-with-avatar` - Generate images with avatar

## 🎯 Features

### Frontend Features
- **Prompt Script Page**: Create and customize lecture prompts
- **Avatar Voice Page**: Select avatar and voice settings
- **Video Export Page**: Export generated content
- **Real-time Backend Connection**: Automatic health checks
- **Error Handling**: Comprehensive error messages and fallbacks

### Backend Features
- **CORS Enabled**: Cross-origin requests supported
- **API Documentation**: Auto-generated Swagger docs
- **Error Handling**: Proper HTTP status codes and error messages
- **Environment Configuration**: Secure API key management

## 🔄 Integration Flow

1. **User Input**: User enters lecture topic and preferences
2. **API Call**: Frontend sends request to backend
3. **AI Processing**: Backend calls Qwen LLM for content generation
4. **Image Generation**: Backend calls Higgsfield for image creation
5. **Response**: Structured data returned to frontend
6. **UI Update**: Frontend displays generated content

## 🛠️ Development

### Project Structure
```
higgsfield/
├── src/                    # Frontend React app
│   ├── components/        # React components
│   ├── services/          # API service layer
│   └── ...
├── higgsfield/            # Backend FastAPI app
│   ├── app/
│   │   ├── routes/        # API routes
│   │   ├── src/
│   │   │   ├── endpoints/ # Endpoint implementations
│   │   │   ├── models/    # Pydantic models
│   │   │   └── services/  # Business logic
│   │   └── ...
│   ├── main.py           # FastAPI app entry point
│   └── requirements.txt  # Python dependencies
├── package.json          # Node.js dependencies
└── README.md
```

### Adding New Features

1. **Backend**: Add new endpoints in `higgsfield/app/routes/`
2. **Frontend**: Add new API calls in `src/services/api.ts`
3. **Integration**: Update components to use new API endpoints

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**:
   - Check Python version (3.8+ required)
   - Verify virtual environment is activated
   - Check if port 8000 is available

2. **Frontend not connecting to backend**:
   - Ensure backend is running on http://localhost:8000
   - Check CORS configuration in `higgsfield/main.py`
   - Verify API service URL in `src/services/api.ts`

3. **API key errors**:
   - Verify `.env` file exists in `higgsfield/` directory
   - Check API key format and validity
   - Ensure environment variables are loaded

### Debug Mode

Enable debug logging by setting environment variables:
```bash
export DEBUG=1  # Linux/Mac
set DEBUG=1     # Windows
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation at http://localhost:8000/docs
- Create an issue in the repository
