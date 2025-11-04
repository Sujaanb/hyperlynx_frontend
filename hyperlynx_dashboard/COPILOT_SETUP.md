# Copilot Integration Setup Guide

## Overview
The Copilot module has been integrated with the backend `/generate` API endpoint, enabling file uploads and AI-powered responses with markdown formatting.

## Changes Made

### 1. Environment Configuration
- **`.env.example`**: Template for environment variables
- **`.env.local`**: Local development configuration (already set up for `http://localhost:8001/api/v1`)

### 2. Dependencies Added
```bash
npm install react-markdown remark-gfm rehype-raw
```

### 3. New Files
- **`src/services/copilotApi.ts`**: API service for communicating with the backend `/generate` endpoint

### 4. Updated Files
- **`src/components/CopilotModule.tsx`**: 
  - Added file upload functionality with paperclip icon
  - Integrated with backend API
  - Added markdown parsing for AI responses
  - Added error handling with visual feedback
  - Added loading states

## Local Development Setup

1. **Start Backend Server** (if not already running):
   ```bash
   cd hyperlynx_backend
   python app.py
   # Backend will run on http://localhost:8001
   ```

2. **Configure Frontend Environment**:
   The `.env.local` file is already configured for local development:
   ```
   VITE_API_URL=http://localhost:8001/HL/content/v1
   ```

3. **Install Dependencies** (already done):
   ```bash
   cd hyperlynx-frontend/hyperlynx_dashboard
   npm install
   ```

4. **Run Frontend**:
   ```bash
   npm run dev
   # Frontend will run on http://localhost:3000
   ```

## Production/Deployment Setup

### For Render Deployment:

1. **Set Environment Variable in Render Dashboard**:
   - Go to your frontend service in Render
   - Navigate to "Environment" section
   - Add a new environment variable:
     - **Key**: `VITE_API_URL`
     - **Value**: Your deployed backend URL + `/HL/content/v1` (e.g., `https://your-backend.onrender.com/HL/content/v1`)

2. **Update `.env.example`** (for team reference):
   ```
   VITE_API_URL=https://your-backend.onrender.com/HL/content/v1
   ```

### Environment Variable Notes:
- Vite requires environment variables to be prefixed with `VITE_`
- Changes to environment variables in Render require a rebuild/redeploy
- The `.env.local` file is gitignored and only for local development

## Features

### File Upload
- Click the paperclip icon next to the message input
- Supported formats: `.pdf`, `.doc`, `.docx`, `.txt`, `.csv`, `.xlsx`, `.xls`
- File is displayed above the input box and can be removed with the X button
- File is sent to the backend along with the user's message

### Markdown Rendering
- AI responses are rendered with full markdown support
- Supports:
  - Headers, lists, tables
  - Code blocks (inline and block)
  - Links (open in new tab)
  - Bold, italic, strikethrough
  - GitHub Flavored Markdown (GFM)

### Error Handling
- Network errors are displayed with red styling
- API errors show the specific error message from the backend
- Loading states prevent duplicate submissions

## Testing Locally

1. Ensure backend is running on port 8001
2. Start the frontend development server
3. Navigate to the Copilot section in the dashboard
4. Try sending a message without a file
5. Try uploading a file and sending a message
6. Verify markdown rendering works correctly
7. Test error handling by stopping the backend

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
- Check that the backend's `BACKEND_CORS_ORIGINS` in `config.py` includes your frontend URL
- For local: should include `http://localhost:3000`
- For production: should include your deployed frontend URL

### API Connection Failed
- Verify `VITE_API_URL` is set correctly
- Check browser console for detailed error messages
- Ensure backend server is running and accessible

### File Upload Not Working
- Check file size limits in backend
- Verify file type is in the accepted list
- Check browser console for errors

## Next Steps
- Test thoroughly in local environment
- Deploy to staging/production
- Monitor for any issues
- Consider adding file size validation on frontend
