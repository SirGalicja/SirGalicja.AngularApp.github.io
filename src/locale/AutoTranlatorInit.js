const childProcess = require('child_process');
const fs = require('fs'); // File System module
const path = require('path');
function executeExe(exePath, messagesBase, messagesTarget, languagefrom, languageto,exportImportType=null,exportImportPath=null,importPathExel=null) {
  const args = [messagesBase, messagesTarget, languagefrom, languageto,exportImportType,exportImportPath,importPathExel]; // Add any additional arguments as needed
  childProcess.execFileSync(exePath, args, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 50 });
}
const cultureTranslatorConsole = "src\\locale\\cultureTranlator\\CultureTranslatorConsole.exe";
const baseMessages =  "src\\locale\\messages.xlf";
const baselocales = "src\\locale";
const baseCopyMessages =  "messages.xlf";
const baseCopyTargetMessages =  'messages.en.xlf';
var xml_special_to_escaped_one_map = {
  '<x ': '&lt;x ',
  '/>': '/&gt;'
};
function encodeXml(string) {
  return string.replace(/([\&"<>])/g, function(str, item) {
      return xml_special_to_escaped_one_map[item];
  });
};
var escaped_one_to_xml_special_map = {
  //'&amp;': '&',
  //'&quot;': '"',
  '&lt;x': '<x ',
  '/&gt;': '/>'
};

function decodeXml(string) {
  // &lt;x /&gt;
//&quot;||&amp;
  return string.replace(/(&lt;x|\/&gt;)/g,
      function(str, item) {
          return escaped_one_to_xml_special_map[item];
  });
}
// Replace with actual path
function xmlFilePath(xmlFilePath){
fs.readFile(xmlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading XML file:', err);
    return;
  }
let xml = decodeXml(data);
fs.writeFile(xmlFilePath, xml, 'utf8', (err) => {
        if (err) {
          console.error('Error writing modified XML:', err);
          return;
        }
        console.log('XML file modified and saved successfully.');
      });
});
}

function xmlFilePathEncode(xmlFilePath){
  fs.readFile(xmlFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading XML file:', err);
      return;
    }
  let xml = encodeXml(data);
  fs.writeFile(xmlFilePath, xml, 'utf8', (err) => {
          if (err) {
            console.error('Error writing modified XML:', err);
            return;
          }
          console.log('XML file modified and saved successfully.');
        });
  });
  }

  /**
 * Kopiuje zawartość pliku messages.xlf do wybranego pliku o tym samym rozszerzeniu.
 * @param {string} destinationPath - Ścieżka do pliku docelowego.
 */
function copyXlfFile(destinationPath) {
  const sourcePath = path.resolve(__dirname, baseCopyMessages);

  // Sprawdź, czy plik źródłowy istnieje
  if (!fs.existsSync(sourcePath)) {
    console.error(`Plik źródłowy ${sourcePath} nie istnieje.`);
    return;
  }

  // Sprawdź, czy plik docelowy ma poprawne rozszerzenie
  if (path.extname(destinationPath) !== '.xlf') {
    console.error('Plik docelowy musi mieć rozszerzenie .xlf');
    return;
  }

  try {
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`Plik bazowy został skopiowany do ${destinationPath}`);
  } catch (err) {
    console.error(`Wystąpił błąd podczas kopiowania pliku: ${err}`);
  }
}


  console.time("Time");
executeExe(cultureTranslatorConsole,
  baseMessages,
  `src\\locales\\messages.de.xlf`,
  'en', 'de');
  console.log("Translation done de ");
executeExe(cultureTranslatorConsole,
  baseMessages,
  `src\\locales\\messages.pl.xlf`,
  'en', 'pl','Export',baselocales);
  console.log("Translation done pl ");

  xmlFilePath(`src\\locales\\messages.de.xlf`);
  xmlFilePath(`src\\locales\\messages.en.xlf`);
  xmlFilePath(`src\\locales\\messages.pl.xlf`);
//kopiowanie pliku bazowego do en
const destinationFilePath = path.resolve(__dirname, baseCopyTargetMessages);
copyXlfFile(destinationFilePath);
  console.timeEnd("Time");

