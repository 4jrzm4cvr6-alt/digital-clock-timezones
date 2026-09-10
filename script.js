// Timezone configuration with major cities
const TIMEZONES = {
    'America/New_York': { city: 'New York', country: 'USA', offset: -5 },
    'America/Chicago': { city: 'Chicago', country: 'USA', offset: -6 },
    'America/Denver': { city: 'Denver', country: 'USA', offset: -7 },
    'America/Los_Angeles': { city: 'Los Angeles', country: 'USA', offset: -8 },
    'America/Anchorage': { city: 'Anchorage', country: 'USA', offset: -9 },
    'Pacific/Honolulu': { city: 'Honolulu', country: 'USA', offset: -10 },
    'Europe/London': { city: 'London', country: 'UK', offset: 0 },
    'Europe/Paris': { city: 'Paris', country: 'France', offset: 1 },
    'Europe/Berlin': { city: 'Berlin', country: 'Germany', offset: 1 },
    'Europe/Madrid': { city: 'Madrid', country: 'Spain', offset: 1 },
    'Europe/Moscow': { city: 'Moscow', country: 'Russia', offset: 3 },
    'Asia/Dubai': { city: 'Dubai', country: 'UAE', offset: 4 },
    'Asia/Kolkata': { city: 'India', country: 'India', offset: 5.5 },
    'Asia/Bangkok': { city: 'Bangkok', country: 'Thailand', offset: 7 },
    'Asia/Hong_Kong': { city: 'Hong Kong', country: 'China', offset: 8 },
    'Asia/Shanghai': { city: 'Shanghai', country: 'China', offset: 8 },
    'Asia/Singapore': { city: 'Singapore', country: 'Singapore', offset: 8 },
    'Asia/Tokyo': { city: 'Tokyo', country: 'Japan', offset: 9 },
    'Asia/Seoul': { city: 'Seoul', country: 'South Korea', offset: 9 },
    'Australia/Sydney': { city: 'Sydney', country: 'Australia', offset: 10 },
    'Australia/Melbourne': { city: 'Melbourne', country: 'Australia', offset: 10 },
    'Pacific/Auckland': { city: 'Auckland', country: 'New Zealand', offset: 12 },
    'Brazil/East': { city: 'São Paulo', country: 'Brazil', offset: -3 },
    'Asia/Kolkata': { city: 'Delhi', country: 'India', offset: 5.5 },
    'Africa/Cairo': { city: 'Cairo', country: 'Egypt', offset: 2 },
    'Africa/Johannesburg': { city: 'Johannesburg', country: 'South Africa', offset: 2 },
};

// Default clocks to display
const DEFAULT_CLOCKS = [
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
];

let activeClocks = DEFAULT_CLOCKS;
let timeFormat = '24'; // '24' or '12'
let updateInterval;

const clockGrid = document.getElementById('clockGrid');
const formatBtns = document.querySelectorAll('.format-btn');
const timezoneSelect = document.getElementById('timezoneSelect');
const addBtn = document.getElementById('addBtn');

// Load saved clocks from localStorage
function loadClocks() {
    const saved = localStorage.getItem('activeClocks');
    const savedFormat = localStorage.getItem('timeFormat');
    
    if (saved) {
        activeClocks = JSON.parse(saved);
    }
    if (savedFormat) {
        timeFormat = savedFormat;
        updateFormatButtons();
    }
}

// Save clocks to localStorage
function saveClocks() {
    localStorage.setItem('activeClocks', JSON.stringify(activeClocks));
}

// Initialize timezone selector
function initializeSelector() {
    const options = Object.keys(TIMEZONES).sort();
    options.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        const info = TIMEZONES[tz];
        option.textContent = `${info.city}, ${info.country} (UTC${info.offset >= 0 ? '+' : ''}${info.offset})`;
        timezoneSelect.appendChild(option);
    });
}

// Format time based on selected format
function formatTime(date, is12Hour = false) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    let period = '';
    
    if (is12Hour) {
        period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
    }
    
    const formattedHours = String(hours).padStart(2, '0');
    
    if (is12Hour) {
        return `${formattedHours}:${minutes}:${seconds} ${period}`;
    }
    return `${formattedHours}:${minutes}:${seconds}`;
}

// Get day of week
function getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

// Get date string
function getDateString(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Create clock card
function createClockCard(timezone) {
    const info = TIMEZONES[timezone];
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const parts = formatter.formatToParts(new Date());
    const timeObj = {};
    parts.forEach(part => {
        if (part.type !== 'literal') {
            timeObj[part.type] = part.value;
        }
    });
    
    const date = new Date(`${timeObj.year}-${timeObj.month}-${timeObj.day}T${timeObj.hour}:${timeObj.minute}:${timeObj.second}`);
    
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.setAttribute('data-timezone', timezone);
    
    const is12Hour = timeFormat === '12';
    const timeString = formatTime(date, is12Hour);
    const dayString = getDayOfWeek(date);
    const dateString = getDateString(date);
    
    card.innerHTML = `
        <button class="btn-remove" onclick="removeClock('${timezone}')">×</button>
        <div class="timezone-name">${timezone.replace(/_/g, ' ')}</div>
        <div class="city-name">${info.city}, ${info.country}</div>
        <div class="digital-time" id="time-${timezone}">${timeString}</div>
        <div class="time-info">
            <div class="info-item">
                <div class="info-label">Day</div>
                <div class="info-value">${dayString}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Date</div>
                <div class="info-value">${dateString}</div>
            </div>
        </div>
    `;
    
    return card;
}

// Update all clocks
function updateClocks() {
    activeClocks.forEach(timezone => {
        const timeElement = document.getElementById(`time-${timezone}`);
        if (timeElement) {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            
            const time = formatter.format(new Date());
            const [hours, minutes, seconds] = time.split(':');
            
            let formattedHours = parseInt(hours);
            let period = '';
            
            if (timeFormat === '12') {
                period = formattedHours >= 12 ? 'PM' : 'AM';
                formattedHours = formattedHours % 12;
                formattedHours = formattedHours ? formattedHours : 12;
                formattedHours = String(formattedHours).padStart(2, '0');
                timeElement.textContent = `${formattedHours}:${minutes}:${seconds} ${period}`;
            } else {
                timeElement.textContent = `${hours}:${minutes}:${seconds}`;
            }
        }
    });
}

// Render all clock cards
function renderClocks() {
    clockGrid.innerHTML = '';
    activeClocks.forEach(timezone => {
        clockGrid.appendChild(createClockCard(timezone));
    });
}

// Remove a clock
function removeClock(timezone) {
    activeClocks = activeClocks.filter(tz => tz !== timezone);
    saveClocks();
    renderClocks();
}

// Add a new clock
function addClock() {
    const timezone = timezoneSelect.value;
    
    if (!timezone) {
        alert('Please select a timezone');
        return;
    }
    
    if (activeClocks.includes(timezone)) {
        alert('This timezone is already displayed');
        return;
    }
    
    activeClocks.push(timezone);
    saveClocks();
    renderClocks();
    timezoneSelect.value = '';
}

// Update time format
function updateTimeFormat(format) {
    timeFormat = format;
    localStorage.setItem('timeFormat', format);
    updateFormatButtons();
    renderClocks();
}

// Update format button states
function updateFormatButtons() {
    formatBtns.forEach(btn => {
        if (btn.getAttribute('data-format') === timeFormat) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Event listeners
formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        updateTimeFormat(btn.getAttribute('data-format'));
    });
});

addBtn.addEventListener('click', addClock);

timezoneSelect.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addClock();
    }
});

// Initialize
loadClocks();
initializeSelector();
updateFormatButtons();
renderClocks();

// Update time every second
updateInterval = setInterval(updateClocks, 1000);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(updateInterval);
});
