# Digital Clock - Multiple Time Zones

A beautiful, interactive digital clock that displays the current time across multiple time zones around the world.

## Features

✨ **Core Features:**
- Display time in 25+ major time zones
- Real-time clock updates every second
- Toggle between 24-hour and 12-hour time formats
- Add or remove time zones dynamically
- Display day and date for each timezone
- Glassmorphism design with smooth animations
- Persistent storage (clocks and format saved locally)
- Fully responsive design

## Included Time Zones

- 🇺🇸 **Americas**: New York, Chicago, Denver, Los Angeles, Anchorage, Honolulu
- 🇪🇺 **Europe**: London, Paris, Berlin, Madrid, Moscow
- 🇦🇸 **Middle East & Asia**: Dubai, India, Bangkok, Hong Kong, Shanghai, Singapore, Tokyo, Seoul
- 🇦🇺 **Oceania**: Sydney, Melbourne, Auckland
- 🌍 **Others**: São Paulo, Cairo, Johannesburg

## How to Use

1. **Open the website** - Load `index.html` in your web browser
2. **View default clocks** - 4 major cities are displayed by default:
   - New York (USA)
   - London (UK)
   - Tokyo (Japan)
   - Sydney (Australia)
3. **Change time format** - Click "24-Hour" or "12-Hour" buttons at the top
4. **Add a timezone** - Select from the dropdown and click "+ Add"
5. **Remove a timezone** - Click the "×" button on any clock card

## Features in Detail

### Time Format Toggle
- **24-Hour Format**: Shows time as 00:00:00 to 23:59:59
- **12-Hour Format**: Shows time with AM/PM indicator

### Clock Cards Display
Each clock card shows:
- Timezone name
- City name and country
- Current time with digital format
- Day of the week
- Date (Month DD, YYYY)

### Data Persistence
- Your selected clocks are saved in browser's localStorage
- Your preferred time format is remembered
- Settings persist even after refreshing the page

## Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Glassmorphism design, gradients, animations
- **JavaScript (ES6)** - Real-time updates, timezone handling
- **Intl API** - JavaScript internationalization for accurate timezone conversion
- **LocalStorage** - Client-side data persistence

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## File Structure

```
digital-clock-timezones/
├── index.html       # Main HTML file
├── styles.css       # Styling with glassmorphism effects
├── script.js        # Clock logic and timezone handling
└── README.md        # Documentation
```

## How It Works

### Timezone Conversion
The application uses the JavaScript `Intl.DateTimeFormat` API to accurately convert the current time to different time zones, ensuring daylight saving time is handled correctly.

### Real-time Updates
- Clock updates every second using `setInterval()`
- Efficient rendering only updates the time display elements
- No page reload needed

### Local Storage
- Active timezone selections are saved
- Time format preference is saved
- Data is stored in browser's localStorage

## Customization

### Add More Time Zones
Edit the `TIMEZONES` object in `script.js`:

```javascript
const TIMEZONES = {
    'Your/Timezone': { city: 'City Name', country: 'Country', offset: 0 }
    // Add more here
};
```

### Change Default Clocks
Modify the `DEFAULT_CLOCKS` array in `script.js`:

```javascript
const DEFAULT_CLOCKS = [
    'America/New_York',
    'Europe/London',
    // Add your defaults here
];
```

## Future Enhancements

- Analog clock display option
- UTC offset reference
- Timezone search functionality
- Weather data integration
- Alarm/reminder functionality
- Multiple themes (dark/light)
- Sunrise/sunset times
- Business hours indicator

## License

MIT
