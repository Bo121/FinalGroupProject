const express = require('express');
const https = require('https');
const qs = require('querystring');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

require("dotenv").config({ path: path.resolve(__dirname, 'credential/.env')});

const app = express();
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); 

const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
const databaseAndCollection = {db: "CMSC335", collection:"FinalProject"};

const rapidApiHost = 'google-translate1.p.rapidapi.com';

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


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

app.post('/translate', async (req, res) => {
  const { name, email } = req.body;
  console.log(`Name: ${name}, Email: ${email}`);

  try {
    const collection = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection);
    const existingEntry = await collection.findOne({ email: email });
    
    if (existingEntry) {
      await collection.updateOne(
        { email: email },
        { $inc: { loginCount: 1 } }
      );
      console.log(`Login count incremented for ${email}`);
    } else {
        await collection.insertOne({ name, email, loginCount: 1 });
        console.log('New user added to MongoDB');
    }
    res.sendFile(path.join(__dirname, 'public', 'translation_service.html'));
  } catch (error) {
    console.error('Error interacting with MongoDB', error);
    res.status(500).send('An error occurred while processing the database operation');
  }
});


app.post('/detectLanguage', (req, res) => {
  const { text } = req.body;

  const postData = qs.stringify({
      q: text
  });

  const options = {
    method: 'POST',
    hostname: rapidApiHost,
    port: null,
    path: '/language/translate/v2/detect',
    headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'application/gzip',
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': rapidApiHost
    }
  };

  const request = https.request(options, function (response) {
    const chunks = [];

    response.on('data', function (chunk) {
    chunks.push(chunk);
    });

    response.on('end', function () {
    const body = Buffer.concat(chunks);
    res.send(body.toString()); 
    });
  });

  request.on('error', (e) => {
    console.error(e);
    res.status(500).send(e.message);
  });

  request.write(postData);
  request.end();
});
  
app.get('/listLanguages', (req, res) => {
  const options = {
    method: 'GET',
    hostname: rapidApiHost,
    path: '/language/translate/v2/languages',
    headers: {
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': rapidApiHost
    }
  };

  const request = https.request(options, function (response) {
    const chunks = [];

    response.on('data', function (chunk) {
      chunks.push(chunk);
    });

    response.on('end', function () {
      const body = Buffer.concat(chunks);
      try {
        const parsed = JSON.parse(body.toString());
        const languageCodes = parsed.data.languages.map(lang => lang.language);

        // Map codes to full names
        const languageFullNames = languageCodes.map(code => languageNames[code] || code);
        res.send(languageFullNames);
        
      } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred while parsing the language list.");
      }
    });
  });

  request.end();
});


app.post('/translateText', (req, res) => {
  const { text, targetLang, sourceLang } = req.body;

  const postData = qs.stringify({
    q: text,
    target: targetLang,
    source: sourceLang
  });

  const options = {
    method: 'POST',
    hostname: rapidApiHost,
    path: '/language/translate/v2',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': rapidApiHost
    }
  };

  const request = https.request(options, function (response) {
    const chunks = [];

    response.on('data', function (chunk) {
      chunks.push(chunk);
    });

    response.on('end', function () {
      const body = Buffer.concat(chunks);
      try {
        const parsed = JSON.parse(body.toString());
        const translatedText = parsed.data.translations[0].translatedText;
        res.send(translatedText);
      } catch (e) {
        console.error(e);
        res.status(500).send("An error occurred while translating the text.");
      }
    });
  });

  request.on('error', (e) => {
    console.error(e);
    res.status(500).send("An error occurred while translating the text.");
  });

  request.write(postData);
  request.end();
});

app.post('/checkLoginCount', async (req, res) => {
  const { email } = req.body;

  try {
    const collection = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection);

    const userEntry = await collection.findOne({ email: email });

    if (userEntry) {
        res.json({ loginCount: userEntry.loginCount });
    } else {
        res.status(404).json({ message: 'Email not found' });
    }
  } catch (error) {
    console.error('Error interacting with MongoDB', error);
    res.status(500).send('An error occurred while processing the database operation');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
