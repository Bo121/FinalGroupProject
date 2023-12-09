async function detectLanguage() {
  const text = document.getElementById('detectText').value;

  try {
    const response = await fetch('/detectLanguage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    });
    const data = await response.json();
    const languageCode = data.data.detections[0][0].language;

    const formattedLanguage = `<strong style="color: blue;font-size: larger;">${languageCode}</strong>`;

    const resultsContainer = document.getElementById('detectionAndTranslationResults');
    resultsContainer.innerHTML = 'Detected Language: ' + formattedLanguage;
  } catch (error) {
      console.error(error);
      document.getElementById('detectionAndTranslationResults').innerText = 'Error detecting language';
  }
}

async function listLanguages() {
  try {
    const response = await fetch('/listLanguages');
    const data = await response.json();
    
    const resultsContainer = document.getElementById('languageListResults');
    resultsContainer.innerHTML = data.join(', '); 
  } catch (error) {
    console.error(error);
    document.getElementById('languageListResults').innerHTML = 'Error listing languages';
  }
}

async function translateText() {
  const text = document.getElementById('translateText').value;
  const targetLang = document.getElementById('targetLang').value;

  try {
    const response = await fetch('/translateText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text, targetLang: targetLang }),
    });
    const translatedText = await response.text();

    const formattedTranslatedText = `<span style="color: green;font-size: larger">${translatedText}</span>`;

    const resultsContainer = document.getElementById('detectionAndTranslationResults');
    resultsContainer.innerHTML =  formattedTranslatedText;
  } catch (error) {
    console.error(error);
    document.getElementById('detectionAndTranslationResults').innerText = 'Error translating text';
  }
}

async function checkLoginCount() {
  const email = document.getElementById('checkEmail').value;

  try {
    const response = await fetch('/checkLoginCount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById('loginCountResult').innerText = 'Login Count: ' + data.loginCount;
    } else {
        const errorData = await response.json();
        document.getElementById('loginCountResult').innerText = errorData.message;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('loginCountResult').innerText = 'Error fetching login count';
  }
}





