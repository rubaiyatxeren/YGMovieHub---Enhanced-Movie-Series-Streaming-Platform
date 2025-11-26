# YGMovieHub - Enhanced Movie Streaming Platform

![YGMovieHub](https://img.shields.io/badge/YGMovieHub-Streaming_Platform-purple?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

A modern, responsive movie and TV show streaming platform built with vanilla JavaScript and Tailwind CSS, featuring multiple embed sources and comprehensive content details.

## 🚀 Live Demo

**[https://ygmoviehub.web.app/](https://ygmoviehub.web.app/)**

## ✨ Features

### 🎬 Content Discovery
- **Trending Movies** - Weekly updated trending content
- **Popular Movies** - All-time popular films
- **TV Shows** - Popular television series
- **Recent Movies** - Latest releases
- **Advanced Search** - Search across movies and TV shows

### 🎥 Streaming Features
- **Multiple Embed Sources** - 7 different streaming servers
- **Server Switching** - Switch between sources seamlessly
- **High-Quality Streaming** - HD content support
- **Fullscreen Support** - Immersive viewing experience

### 📱 User Experience
- **Responsive Design** - Works on all devices
- **Modern UI/UX** - Gradient themes and smooth animations
- **Fast Loading** - Optimized performance
- **Intuitive Navigation** - Easy content discovery

### 🔍 Content Details
- **Comprehensive Information** - Ratings, genres, runtime, etc.
- **Cast & Crew** - Full credits with photos
- **Additional Metadata** - Budget, revenue, production companies
- **Download Options** - Direct download links

### 📺 TV Show Support
- **Season Selection** - Browse by seasons
- **Episode Lists** - Complete episode guides
- **Episode Downloads** - Individual episode downloads
- **Show Metadata** - Network information, episode counts

## 🛠️ Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **API**: The Movie Database (TMDB) API
- **Icons**: Font Awesome 6.4.0
- **Hosting**: Firebase Hosting
- **Analytics**: Google Analytics

## 📦 Installation

### Prerequisites
- Node.js (for local development)
- TMDB API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/rubaiyatxeren/YGMovieHub.git
   cd YGMovieHub
   ```

2. **Set up TMDB API**
   - Get your API key from [The Movie Database](https://www.themoviedb.org/settings/api)
   - Replace the `TMDB_API_KEY` in `js/app.js`:
   ```javascript
   const TMDB_API_KEY = "your_api_key_here";
   ```

3. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deployment

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Deploy
firebase deploy
```

#### Other Platforms
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Enable in repository settings

## 🎯 Usage

### Browsing Content
1. Scroll through categorized sections
2. Click on any movie/TV show card to open details
3. Use the search bar for specific content

### Streaming
1. Open content modal
2. Select preferred streaming server
3. Click play to start streaming
4. Use fullscreen for better experience

### TV Shows
1. Open TV show details
2. Select season from buttons
3. Choose episode for streaming/download
4. Access individual episode downloads

## 🔧 Configuration

### Customizing Embed Sources
Edit the `EMBED_SOURCES` array in `js/app.js`:

```javascript
const EMBED_SOURCES = [
  {
    name: "Custom Server",
    url: (type, id) => `https://example.com/embed/${type}/${id}`
  },
  // Add more sources...
];
```

### Styling Customization
Modify Tailwind classes in:
- `css/main.css` for custom styles
- HTML files for layout changes
- Color scheme in Tailwind config

## 📱 Supported Platforms

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ✅ Tablet (iPad, Android tablets)
- ✅ TV (Smart TV browsers)

## 🌐 API Integration

### TMDB Endpoints Used
- `/trending/movie/week` - Trending movies
- `/movie/popular` - Popular movies
- `/tv/popular` - Popular TV shows
- `/movie/now_playing` - Recent movies
- `/search/multi` - Content search
- `/movie/{id}` - Movie details
- `/tv/{id}` - TV show details
- `/tv/{id}/season/{season}` - Season episodes
- `/movie/{id}/credits` - Cast information

## 🔒 Privacy & Security

- No user data collection
- External content via iframes
- HTTPS enforced
- No tracking cookies

## 🐛 Troubleshooting

### Common Issues

1. **Content not loading**
   - Check TMDB API key
   - Verify internet connection
   - Check browser console for errors

2. **Streams not working**
   - Try different server
   - Check ad-blocker settings
   - Verify iframe permissions

3. **Mobile issues**
   - Clear browser cache
   - Update browser
   - Check data connection

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Test on multiple devices
- Ensure responsive design
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Movie Database** for comprehensive movie data
- **Tailwind CSS** for utility-first styling
- **Font Awesome** for beautiful icons
- **Firebase** for hosting and analytics
- **All embed source providers** for streaming capabilities

## 📞 Support

For support and questions:
- 📧 Email: info.ygstudiobd@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/rubaiyatxeren/YGMovieHub/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/rubaiyatxeren/YGMovieHub/discussions)

## 🔄 Changelog

### v2.0.0 (Current)
- Multiple embed sources
- Enhanced TV show support
- Improved UI/UX
- Better mobile experience

### v1.0.0
- Initial release
- Basic streaming functionality
- TMDB integration
- Responsive design

---

**⭐ Star this repo if you find it helpful!**

**Developed with ❤️ by eRubaiyat**
