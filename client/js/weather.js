// weather forecast for the event date (Open-Meteo API, max 16 days ahead)
function showWeather(event) {
    const div = document.getElementById('weather');

    if (!event.latitude || !event.longitude) {
        div.innerHTML = '<p class="event-meta">No location coordinates for this event.</p>';
        return;
    }

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + event.latitude +
        '&longitude=' + event.longitude +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=16';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Find the event date in the list of forecast days
            let dayIndex = -1;
            for (let i = 0; i < data.daily.time.length; i++) {
                if (formatDate(data.daily.time[i]) === formatDate(event.event_date)) {
                    dayIndex = i;
                }
            }

            if (dayIndex === -1) {
                div.innerHTML = '<p class="event-meta">The forecast is only available up to 16 days before the event.</p>';
                return;
            }

            const description = getWeatherDescription(data.daily.weather_code[dayIndex]);
            const minTemp = data.daily.temperature_2m_min[dayIndex];
            const maxTemp = data.daily.temperature_2m_max[dayIndex];
            div.innerHTML = `<p><strong>${description}</strong></p>
                <p class="event-meta">Temperature: ${minTemp}&deg;C to ${maxTemp}&deg;C</p>`;
        })
        .catch(error => {
            console.error('Error fetching weather', error);
            div.innerHTML = '<p class="event-meta">Weather forecast is not available right now.</p>';
        });
}

// converts the weather code to text
function getWeatherDescription(code) {
    if (code === 0) {
        return 'Clear sky';
    } else if (code === 1 || code === 2 || code === 3) {
        return 'Mainly clear, partly cloudy, or overcast';
    } else if (code === 45 || code === 48) {
        return 'Fog';
    } else if (code === 51 || code === 53 || code === 55) {
        return 'Drizzle';
    } else if (code === 61 || code === 63 || code === 65) {
        return 'Rain';
    } else if (code === 80 || code === 81 || code === 82) {
        return 'Rain showers';
    } else if (code === 95) {
        return 'Thunderstorm';
    }
    return 'Weather code ' + code;
}
