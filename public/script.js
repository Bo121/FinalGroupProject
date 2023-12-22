const languageNames = {
  'af': 'Afrikaans',
  'ak': 'Akan',
  'am': 'Amharic',
  'ar': 'Arabic',
  'as': 'Assamese',
  'ay': 'Aymara',
  'az': 'Azerbaijani',
  'be': 'Belarusian',
  'bg': 'Bulgarian',
  'bho': 'Bhojpuri',
  'bm': 'Bambara',
  'bn': 'Bengali',
  'bs': 'Bosnian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'ckb': 'Central Kurdish',
  'co': 'Corsican',
  'cs': 'Czech',
  'cy': 'Welsh',
  'da': 'Danish',
  'de': 'German',
  'doi': 'Dogri',
  'dv': 'Dhivehi',
  'ee': 'Ewe',
  'el': 'Greek',
  'en': 'English',
  'eo': 'Esperanto',
  'es': 'Spanish',
  'et': 'Estonian',
  'eu': 'Basque',
  'fa': 'Persian',
  'fi': 'Finnish',
  'fr': 'French',
  'fy': 'Western Frisian',
  'ga': 'Irish',
  'gd': 'Scottish Gaelic',
  'gl': 'Galician',
  'gn': 'Guarani',
  'gom': 'Goan Konkani',
  'gu': 'Gujarati',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'he': 'Hebrew',
  'hi': 'Hindi',
  'hmn': 'Hmong',
  'hr': 'Croatian',
  'ht': 'Haitian Creole',
  'hu': 'Hungarian',
  'hy': 'Armenian',
  'id': 'Indonesian',
  'ig': 'Igbo',
  'ilo': 'Iloko',
  'is': 'Icelandic',
  'it': 'Italian',
  'iw': 'Hebrew (old code)',
  'ja': 'Japanese',
  'jv': 'Javanese',
  'jw': 'Javanese (alternative code)',
  'ka': 'Georgian',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'kn': 'Kannada',
  'ko': 'Korean',
  'kri': 'Krio',
  'ku': 'Kurdish',
  'ky': 'Kyrgyz',
  'la': 'Latin',
  'lb': 'Luxembourgish',
  'lg': 'Ganda',
  'ln': 'Lingala',
  'lo': 'Lao',
  'lt': 'Lithuanian',
  'lus': 'Mizo',
  'lv': 'Latvian',
  'mai': 'Maithili',
  'mg': 'Malagasy',
  'mi': 'Maori',
  'mk': 'Macedonian',
  'ml': 'Malayalam',
  'mn': 'Mongolian',
  'mni-Mtei': 'Manipuri (Meitei Mayek script)',
  'mr': 'Marathi',
  'ms': 'Malay',
  'mt': 'Maltese',
  'my': 'Burmese',
  'ne': 'Nepali',
  'nl': 'Dutch',
  'no': 'Norwegian',
  'nso': 'Northern Sotho',
  'ny': 'Nyanja (Chichewa)',
  'om': 'Oromo',
  'or': 'Odia (Oriya)',
  'pa': 'Punjabi',
  'pl': 'Polish',
  'ps': 'Pashto',
  'pt': 'Portuguese',
  'qu': 'Quechua',
  'ro': 'Romanian',
  'ru': 'Russian',
  'rw': 'Kinyarwanda',
  'sa': 'Sanskrit',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'sm': 'Samoan',
  'sn': 'Shona',
  'so': 'Somali',
  'sq': 'Albanian',
  'sr': 'Serbian',
  'st': 'Southern Sotho',
  'su': 'Sundanese',
  'sv': 'Swedish',
  'sw': 'Swahili',
  'ta': 'Tamil',
  'te': 'Telugu',
  'tg': 'Tajik',
  'th': 'Thai',
  'ti': 'Tigrinya',
  'tk': 'Turkmen',
  'tl': 'Tagalog',
  'tr': 'Turkish',
  'ts': 'Tsonga',
  'tt': 'Tatar',
  'ug': 'Uyghur',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'xh': 'Xhosa',
  'yi': 'Yiddish',
  'yo': 'Yoruba',
  'zh': 'Chinese',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'zu': 'Zulu'
};

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

    // Convert the language code to the full language name
    const languageName = languageNames[languageCode] || languageCode;

    const formattedLanguage = `<strong style="color: blue;font-size: larger;">${languageName}</strong>`;

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
    const languageCodes = await response.json();
    
    const resultsContainer = document.getElementById('languageListResults');
    resultsContainer.innerHTML = ''; // Clear the list first
    languageCodes.forEach(code => {
      // Assuming you have a way to map codes to full language names
      const languageName = languageNames[code] || code;
      const languageDiv = document.createElement('div');
      languageDiv.className = 'language-item';
      languageDiv.textContent = languageName;
      languageDiv.onclick = () => setTargetLanguage(code);
      resultsContainer.appendChild(languageDiv);
    });
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

function setTargetLanguage(languageCode) {
  document.getElementById('targetLang').value = languageCode;
}



