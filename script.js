const API_KEY = 'DEMO_KEY'; // Replace with your own API key if available
const APOD_URL = 'https://api.nasa.gov/planetary/apod';

// Elements for Today's APOD
const apodImage = document.getElementById('apod-image');
const apodTitle = document.getElementById('apod-title');
const apodDate = document.getElementById('apod-date');
const apodExplanation = document.getElementById('apod-explanation');

// Elements for Historical APOD
const datePicker = document.getElementById('date-picker');
const loadButton = document.getElementById('load-button');
const historicalContainer = document.getElementById('historical-apod');

// Set max attribute of date input to today's date
datePicker.max = new Date().toISOString().split('T')[0];

// Function to fetch and display APOD data
async function fetchAPOD(date = '') {
  try {
    const url = date 
      ? `${APOD_URL}?api_key=${API_KEY}&date=${date}` 
      : `${APOD_URL}?api_key=${API_KEY}`;
      
    const response = await fetch(url);
    const data = await response.json();

    // Some APOD entries are videos; check for media type
    if (data.media_type === 'image') {
      return data;
    } else {
      // Fallback for video: use thumbnail if available or notify the user
      data.url = data.thumbnail_url || '';
      return data;
    }
  } catch (error) {
    console.error('Error fetching APOD:', error);
  }
}

// Display Today's APOD on page load
async function displayTodayAPOD() {
  const data = await fetchAPOD();
  if (data) {
    apodImage.src = data.url;
    apodImage.alt = data.title;
    apodTitle.textContent = data.title;
    apodDate.textContent = data.date;
    apodExplanation.textContent = data.explanation;
  }
}

// Load historical APOD when a date is selected
async function loadHistoricalAPOD() {
  const selectedDate = datePicker.value;
  if (!selectedDate) {
    alert('Please select a date.');
    return;
  }
  const data = await fetchAPOD(selectedDate);
  if (data) {
    // Clear previous content
    historicalContainer.innerHTML = '';

    // Create elements to display the historical APOD
    const img = document.createElement('img');
    img.src = data.url;
    img.alt = data.title;

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('apod-info');
    infoDiv.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.date}</p>
      <p>${data.explanation}</p>
    `;

    historicalContainer.appendChild(img);
    historicalContainer.appendChild(infoDiv);
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', displayTodayAPOD);
loadButton.addEventListener('click', loadHistoricalAPOD);
