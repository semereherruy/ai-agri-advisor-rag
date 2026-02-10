# Frontend - AI Agriculture Advisor

React frontend for the AI Agriculture Advisor chat interface.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

- **Mobile-first responsive design** - Works on 360×800 (mobile) and 768×1024 (tablet)
- **Smooth animations** - Fade-in messages, typing indicators, slide animations
- **Multi-language support** - Automatic Ge'ez script detection for Amharic/Tigrigna
- **Source display** - Collapsible sources panel showing document references
- **Feedback system** - Thumbs up/down feedback after each response
- **Error handling** - Toast notifications for errors

## Components

- **ChatPage** - Main container component
- **ChatWindow** - Scrollable message area
- **MessageBubble** - Individual message display (user/assistant)
- **InputBar** - Text input with send button and mic placeholder
- **TypingIndicator** - Animated three-dot indicator
- **SourcesPanel** - Collapsible sources display
- **FeedbackBar** - Thumbs up/down feedback buttons
- **Toast** - Error notification component

## Design System

### Colors
- Background: `#F6FBF7` (soft off-white)
- Assistant bubble: `#E6F8ED` (light green)
- User bubble: `#2F9E44` (vivid green)
- Accent/buttons: `#60A664` (muted green)
- Text primary: `#0B2B17` (dark green/charcoal)
- Text muted: `#65746B` (gray-green)

### Typography
- Font: Inter or Noto Sans
- Base size: 16px
- High contrast for accessibility

### Animations
- Message enter: 220ms fade-in + slide up
- Typing indicator: 800ms loop
- Send button: 100ms scale on press
- Sources panel: 200ms slide expand/collapse
- Toast: Slide from top, 3s auto-dismiss

## API Integration

The frontend connects to the backend API at `http://localhost:8000`:
- `POST /chat` - Send questions and receive answers
- `POST /feedback` - Submit user feedback

## Development

Built with:
- React 18
- TypeScript
- CSS3 animations
- Mobile-first responsive design

## Notes

- Ensure the backend is running before starting the frontend
- CORS is configured to allow requests from `localhost:3000`
- Ge'ez script detection automatically enables translation

