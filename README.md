# SpotiFill - Time-Based Playlist Generator

## Problem Statement
Have you ever needed music for a specific duration? Whether it's a 30-minute workout, a 45-minute commute, a 2-hour study session, or a 25-minute Pomodoro work block, manually creating playlists that fit exact time slots is tedious. You have to keep adding songs, checking the total duration, removing songs if it's too long, and the process takes forever. SpotiFill solves this problem by automatically generating Spotify playlists that match your desired duration perfectly!

## Solution
SpotiFill uses the Spotify Web API to intelligently select and combine tracks to create playlists that match your specified duration. The app analyzes your music taste (through your top tracks) or lets you choose specific genres, then uses a smart algorithm to find the optimal combination of songs that gets as close as possible to your target time.

## API Used
- **API Name**: Spotify Web API
- **API Documentation**: [https://developer.spotify.com/documentation/web-api/](https://developer.spotify.com/documentation/web-api/)
- **How it's used**: 
  - Authenticates users via OAuth 2.0
  - Fetches user's top tracks to understand music taste
  - Gets genre seeds for genre-based generation
  - Retrieves track recommendations based on seeds and audio features
  - Creates and saves playlists directly to user's Spotify account

## Features
- **Flexible Time Input**: Use slider or preset buttons (15 min to 3 hours)
- **Multiple Music Sources**: Generate from your top tracks or choose specific genres
- **Mood Selection**: Energetic, Balanced, Chill, or Focused playlists
- **Smart Duration Matching**: Algorithm optimizes track selection to match target duration
- **Live Preview**: See your playlist before saving
- **One-Click Save**: Save directly to your Spotify account
- **Accuracy Indicator**: Shows how close the playlist is to your target duration

## Setup Instructions

### Prerequisites
1. You need a Spotify account (free or premium)
2. Node.js installed on your computer

### Getting Your Spotify API Credentials
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details:
   - App name: SpotiFill (or your choice)
   - App description: Time-based playlist generator
5. Once created, you'll see your Client ID
6. In app settings, add `http://localhost:5173/` as a Redirect URI
7. Save your settings

### Running the Application
1. Clone this repository
2. Run `npm install`
3. Open `src/App.js` and replace `YOUR_SPOTIFY_CLIENT_ID` with your actual Client ID
4. Run `npm run dev`
5. Open [http://localhost:5173](http://localhost:5173)
6. Click "Connect with Spotify" and authorize the app
7. Start generating perfect playlists!

## How to Use
1. **Connect Your Spotify**: Click the login button and authorize the app
2. **Set Your Duration**: Use the slider or preset buttons to set how long you want your playlist
3. **Choose Your Preferences**:
   - Source: Your top tracks or specific genre
   - Mood: Energetic, Balanced, Chill, or Focused
4. **Generate**: Click "Generate Playlist" and watch the magic happen
5. **Review**: Check out your perfectly-timed playlist
6. **Save**: Give it a name and save it to your Spotify account

## Technical Implementation
The app uses React with functional components and hooks. The playlist generation algorithm uses a variation of the knapsack problem solution to find the optimal combination of tracks that best matches the target duration. It fetches recommendations from Spotify based on your preferences and intelligently selects tracks to minimize the difference between actual and target duration.

## AI Assistance
I used Claude to help with:
- **React Component Structure**: Claude helped design the component hierarchy and state management patterns. I learned about lifting state up and proper component composition.
- **Spotify API Integration**: Claude provided guidance on OAuth flow implementation and proper API endpoint usage. I modified the authentication to use implicit grant flow for simplicity.
- **Algorithm Design**: Claude suggested using a dynamic programming approach for optimal track selection. I simplified it to a greedy algorithm for the MVP to improve performance.
- **CSS Styling**: Claude provided the base styling structure with gradients and animations. I customized the color scheme and added my own hover effects.
- **Error Handling**: Claude showed me patterns for handling API failures gracefully. I added specific handling for token expiration.

## Screenshots
![Image](pic1.png)

## Future Improvements
- **Advanced Algorithm**: Implement full dynamic programming solution for even better duration matching
- **Playlist Flow**: Order tracks by tempo/energy for workout playlists
- **Discovery Slider**: Control how much new music vs familiar tracks
- **Multiple Playlists**: Generate several playlist options to choose from
- **Collaborative Playlists**: Generate playlists based on multiple users' tastes
- **Export Options**: Export to Apple Music, YouTube Music, etc.
- **Listening History**: Save and replay previously generated playlist parameters
- **Smart Presets**: "Morning Commute", "Gym Session", "Study Time" with optimized settings

## Technologies Used
- React 18 with Hooks
- Vite for fast development
- Spotify Web API
- CSS3 with animations
- Local Storage for token persistence

## License
MIT License - feel free to use this project as inspiration for your own ideas!

---
*Built with ❤️ and ☕ for anyone who's ever needed the perfect-length playlist*