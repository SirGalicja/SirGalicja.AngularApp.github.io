const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('xmldom');
const directoryPath = path.resolve(__dirname, '../../src'); // Ensure the path is correct
const replacements = [
  { from: '1 Sample', to: 'Example01', toPL: 'Pierwsza Próbka' },
  { from: '2 Sample', to: 'Example02', toPL: 'Pierwsza Próbka' },
  { from: '3 Sample', to: 'Example03', toPL: 'Pierwsza Próbka' },
  
  
  { from: 'Example01', to: '1 Sample', toPL: 'Pierwsza Próbka' },
  { from: 'Example02', to: '2 Sample', toPL: 'Pierwsza Próbka' },
  { from: 'Example03', to: '3 Sample', toPL: 'Pierwsza Próbka' }
]



if (!fs.existsSync(directoryPath)) {
    console.error(`❌ Directory does not exist: ${directoryPath}`);
    process.exit(1); // Exit the script with an error code
}

function searchAndReplaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    replacements.forEach(({ from, to }) => {

      const regex = new RegExp(`\\$localize\`([^\`]*?)\\b${from}\\b([^\`]*)\``, 'g');
      // g - global
      // \$ - dosłownie znak $
      // \` - że slash sie stosuje by nie zamknąć pod tym samym slash'u

      if (regex.test(content)) {
        content = content.replace(regex, (_, before, after) =>
          `$localize\`${before}${to}${after}\``);
        changed = true;
        console.log(`Znalazło plik`,to)
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✔ Zmieniono w: ${filePath}`);
    }

}
function replaceInXlfFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const dom = new DOMParser().parseFromString(content, 'application/xml');
  let changed = false;

  const sources = Array.from(dom.getElementsByTagName('source'));
  const targets = Array.from(dom.getElementsByTagName('target'));
  const tags = [...sources, ...targets];

  console.log(`✔ tags: `, tags.length);
  tags.forEach((node) => {
    replacements.forEach(({ from, to }) => {
      if (node.textContent.includes(from)) {
        node.textContent = node.textContent.replace(from, to);
        changed = true;
      }
    });
  });

  if (changed) {
    const newXml = new XMLSerializer().serializeToString(dom);
    fs.writeFileSync(filePath, newXml, 'utf-8');
    console.log(`✔ Zmieniono w pliku XLF: ${filePath}`);
  }
}


function walkDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDirectory(fullPath);
        } else if (entry.isFile() && fullPath.endsWith('.ts')) {
            //console.log(`✔ File: ${fullPath}`);
            searchAndReplaceInFile(fullPath);
        }
       else if (fullPath.endsWith('.xlf') ) {

        //replaceInXlfFile(fullPath);
        //xmlFilePath(fullPath);
        //console.log(`✔ Processed XLF file: ${fullPath}`);
      }
    }
}
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
// Start
walkDirectory(directoryPath);//
