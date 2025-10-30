const fs = require('fs');
const path = require('path');
const { from } = require('rxjs');
//const { DOMParser, XMLSerializer } = require('xmldom'); //npm install xmldom --legacy-peer-deps
const directoryPath = path.resolve(__dirname, '../../src'); // Ensure the path is correct

// fronm    -   text that you want to change
// to       -   to text you want your original text to change
// id       -   id of i18n attribute

// id = ''                  - id generowane automatycznie
// id = '{some_text_here}'  - custom id


// Podejście obiektowe:
class TranslateClassFromExcel{
    from;
    to;
    id;
    isnewId;
    static rowID = 0;
    
    constructor({from, to, id, isnewId}) {
        this.from = from;
        this.to = to;
        this.id = id;
        this.isnewId = isnewId;
    }
 
    // sprawdzanie czy podane dane są odpowiednie
    isGoodDataType(){
        let sprwadzanie = false
        if (typeof this.isnewId === 'string'){
            if(this.isnewId == 'true')
                this.isnewId = true   
            else if(this.isnewId == 'false')
                this.isnewId = false
        }
        if(
            typeof this.from    === 'string' &&
            typeof this.to      === 'string' &&
            typeof this.isnewId === 'boolean' 
        ){
            if(typeof this.id === 'number'){
                this.id.toString()
                sprwadzanie = true 
            }   
            else if(typeof this.id === 'string'){
                sprwadzanie = true
            }
        }  
        return sprwadzanie;
    }

    ifnotcustomID(){
        if(/^[0-9]+$/.test(this.id))
        {
            this.id = '';
        }
    }

    ifnoIDbutTrue(){
        if(this.id == '' && this.isnewId == true){
            this.isnewId = false
            //console.log(`Zmienna jest zmieniona z true na false`)
        }
        // console.log(`Zmienna się wykonuje poprawnie`)
    }

    newID(){
        let newId = '';
        if(this.isnewId){
            newId = this.to.replace(/[^a-zA-Z0-9]/g, '')
        }
        return newId;
    }

}

class Database{
    db = []
    constructor(){

    }

    addObject(object){
        if(object.isGoodDataType()){
            TranslateClassFromExcel.rowID ++
            object.rowID = TranslateClassFromExcel.rowID

            object.ifnotcustomID()
            object.ifnoIDbutTrue()
            //object.newID()

            this.db.push(object)
        }
    }

    // searchandreplace funkcja:

    searchAndReplace(filePath){
        let content = fs.readFileSync(filePath, 'utf-8');
        let changed = false;

        function replace(regex, from, to){

            if(regex.test(content))
            {
                // console.log(`Regex znaleziony`, regex)
                changed = true;
                console.log(`Znalazło dane to tłumaczenia: ${from}  |na:| ${to}`)
            
                content = content.replace(regex, (_, opentag, nameoftag, i18nattribute, close1, close2, inner, closetag) => {
                    //console.log(`Tag: ${opentag}   Inner: ${inner}   Close-Tag: ${closetag}`);
                    const newInner = inner.split(from).join(to);
                
                    return `${opentag}${newInner}${closetag}`;
                });   
            }  
            if (changed) {
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`✔ Zmieniono w: ${filePath}`);
            }
            else {
                console.log(`❌ Nie znaleziono`)
            }
        }
        
        this.db.forEach(({ from, to, id }) => {
        
            const isId = "";

            let istrue;
            // isId == id
            // ? istrue = false
            // : istrue = true;

            // inny zapis
            istrue = isId != id;

            console.log(`Podane id: ${id}`);
            // console.log(`Czy ma id: ${istrue}`)

            let searchedRegex
            let searchedRegexAttribute

            // do regex'a:
            // lookahead => (?!) nie może być po tym, (?=) musi być po tym

            // i18n   do poprawy
            
            istrue == true
            ? searchedRegex = new RegExp(
            `(<(\\w+|\\w+-\\w+)\\b\\s[^>]*` +
            `\\bi18n\\b\\s*(?!-)=\\s*()()` +
            `(['"])[^"'>]*@@${id}\\b(?:\\|[^"'>]*)?\\5[^>]*>)` + 
            `(${from})` +                          
            `(<\\/\\2>)`,                                      
            'g' 
            // (<(\w+|\w+-\w+)\b\s[^>]*\bi18n\b\s*(?!-)=\s*()()
            // (['"])[^"'>]*@@${id}\b(?:\|[^"'>]*)?\5[^>]*>)(${from})(<\/\2>)
            )
            : searchedRegex = new RegExp(
            `(<(\\w+|\\w+-\\w+)\\b\\s[^>]*` +      
            `\\bi18n\\b(?!-)\\s*()()` +             
            `(?:` +                             
            `(?:(?!=)[^>]*>)` +
            `|` +                               
            `(?:=\\s*(['"])[^"'@>]*\\5[^>]*>)` +  
            `))`+                                    
            `(${from})` +                       
            `(<\\/\\2>)`,                       
            'g'
            );
            // (<(\w+|\w+-\w+)\b\s[^>]*\bi18n\b(?!-)\s*()()(?:(?:(?!=)[^>]*>)|
            // (?:=\s*(['"])[^"'@>]*\5[^>]*>)))(${from})(<\/\2>)
            
            //================================================================================

            // i18n-  zrobione
            
            istrue == true
            ? searchedRegexAttribute = new RegExp(
            `(<(\\w+|\\w+-\\w+)\\b\\s[^>]*` +
            `\\bi18n-\\b(\\w+|\\w+-\\w+)\\b\\s*` +
            `=\\s*(['"])[^"'>]*@@${id}\\b(?:\\|[^"'>]*)?\\4[^>]*` + 
            `\\b\\3=(['"]))` +
            `(${from})` +
            `(\\5[^>]*>)`,                                      
            'g'     
            )
            // (<(\w+|\w+-\w+)\b\s[^>]*\bi18n-\b(\w+|\w+-\w+)\b\s*=\s*(['"])[^"'>]*@@${id}\b(?:\|[^"'>]*)?\4[^>]*
            // \b\3=(['"]))(${from})(\5[^>]*>)
            : searchedRegexAttribute = new RegExp(
            `(<(\\w+|\\w+-\\w+)\\b\\s[^>]*` +
            `\\bi18n-\\b(\\w+|\\w+-\\w+)\\b\\s*` +
            `(?:` +
            `(?:(?!=)[^>]*)` +
            `|` + 
            `(?:=\\s*(['"])[^"'@>]*\\4[^>]*)` +  
            `)`+
            `\\b\\3=(['"]))` +   
            `(${from})` + 
            `(\\5[^>]*>)`,                     
            'g'
            );  

            //(i18n-\b(\w+|\w+-\w+)\b\s*(?:(?:(?!=)[^>]*)|(?:=\s*(['"])[^"'@>]*\3[^>]*))\2=(['"]))(auto)(\4)

            //(<(\w+|\w+-\w+)\b\s[^>]*\bi18n-\b(\w+|\w+-\w+)\b\s*(?:(?:(?!=)[^>]*)
            //|(?:=\s*(['"])[^"'@>]*\4[^>]*))\3=(['"]))(${from})(\5[^>]*>)
            
            // wywoływanie funkcji
            replace(searchedRegex, from, to)
            replace(searchedRegexAttribute, from, to)
        })
        
    }

    forEach(callback) {
        this.db.forEach(callback);
    }

    changeid(){

    }
    
}
    
// Zadanie:
// [+] Dać tutaj metody z search_and_replace, przemienić je, sprawdić czy działają,
// [+] zmienić regexy tak, by dodać kolejną grupę jaką jest ID, by było można je zmienić
// [+] !!!!!!! Naprawić skrypt w search and replace (dodać grupę na tag, zmienić regexy)

// [] - poprawić regexy: problemy: i18n-properties
// [] - zrobić program do SORTOWANIA w html rzeczy: by wychwytywało i zmieniało kolejność:
// np z: i18n-text title="" i18n-title text="" |NA:| i18n-text text="" i18n-title tile=""


// Później:
// []- zająć się podobnie replace-localize.js
// []- dodać możliwość zmiany id z braku (braku customowego) na customowy (metoda)
//      ^ zapytać się o to, skąd i gdzie zmienić id, czy w plikach html, czy w json
// []- zrobić by kod był bardziej przejrzysty (impossible xD)


const tabelaDoTestów = [
  { from: 'auto',               to: 'samochód',                         id: ''},
  { from: 'auto',               to: 'samojezdny pojazd :>',             id: ''},
  { from: 'auto',               to: 'samojezdny pojazd :>',             id: 'bra tek'},
  { from: 'auto',               to: 'Pociąg :D',                        id: 'something'},
  { from: 'auto',               to: 'Samolocik Hue Hue Hue',            id: 'someID'},
  { from: 'auto',               to: 'To jest Tag bez id :D',            id: ''},
  { from: 'title',              to: 'To Title Tag bez id :)',           id: ''},
  { from: 'some title here',    to: 'tile hehehe',                      id: ''},
  { from: 'tile hehehe',        to: 'sample',                           id: ''}
  
];

// obiekt dla przykładowych danych podanych w tabeli do testów powyżej:
// let replacements = new Database;   

// obiekt dla danych z pliku json:
let replacements_for_json = new Database;

// funkcja zmieniająca miejscami atrybuty itp w html - z chata gbt:
// trzeba do tej funkcji zainstalować: npm install jsdom (Wykomentowane. Postaram się stworzyć własną funkcję)
{
// function sortTagAttributes(html) {
//   const { JSDOM } = require("jsdom");
//   const dom = new JSDOM(html);
//   const { document } = dom.window;

//   function sortAttrs(node) {
//     if (node.nodeType !== 1) return; // tylko elementy

//     const attrs = Array.from(node.attributes);

//     attrs.sort((a, b) => {
//       const baseA = a.name.replace(/^i18n-/, "");
//       const baseB = b.name.replace(/^i18n-/, "");

//       if (baseA === baseB) {
//         return a.name.startsWith("i18n-") ? -1 : 1;
//       }

//       return baseA.localeCompare(baseB);
//     });

//     // usuń i dodaj posortowane atrybuty
//     for (const attr of attrs) node.removeAttribute(attr.name);
//     for (const attr of attrs) node.setAttribute(attr.name, attr.value);

//     for (const child of node.children) sortAttrs(child);
//   }

//   for (const el of document.body.children) sortAttrs(el);

//   return document.body.innerHTML;
// }
}

// pomysł:
// aż do momentu, kiedy cały czas będzie wychwycało regexa, robić:
// regex: i18n-atrybut (w środku grupa z i18n-atrybut, która może wiele razy wystąpić) atrybut
// wtedy zamienia miejscami grupy tak, by było
// (i18n-atrybut) (atrybut) (to co było w środku)

function sortinsidehtml(filePath){
    let content = fs.readFileSync(filePath, 'utf-8');

    const regex = new RegExp(
        ``,
        'g'
    )
    while(regex.test(content)){

    }
    content.matchAll()
}

// inny pomysł:
// jak istnieje sposób na zrobienie by regex mógł przechodzić przez te same dane jeśli inny regex zliczy jakoś
// ilość wystąpień. Wtedy to zrobić pętlę, która będzie działać przez tyle ile wystąpi 


function importObjectstoDatabase(array_from, array_to){

    array_from.forEach(obj => {
        
        const normalized = {
            from    :obj.from    ?? obj.source,
            to      :obj.to      ?? obj.target,
            id      :obj.id,
            isnewId :obj.isnewId ?? false
        }
        
        const instance = new TranslateClassFromExcel(normalized);  // <-- instancja klasy
        array_to.addObject(instance);                       // <-- dodanie instancji
        //console.log(instance);
    });

    // console.log(array_to)
}



if (!fs.existsSync(directoryPath)) {
    console.error(`❌ Directory does not exist: ${directoryPath}`);
    process.exit(1); // Exit the script with an error code
}



function processHtmlFileDxTreeList(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Sprawdź czy jest <grid-view-toolbar>
    if (content.includes('<grid-view-toolbar')) {
        console.log(`✔ Found <grid-view-toolbar> in: ${filePath}`);

        // Czy w pliku jest <dx-data-grid> z <dxo-toolbar> ?
       // const dxDataGridRegex =/<(dx-data-grid|dx-tree-list)[\s\S]*?>[\s\S]*?<\/\1>/g;// /<dx-data-grid[\s\S]*?>[\s\S]*?<\/dx-data-grid>/g;
        //const dxDataGridRegex =/<dx-data-grid[\s\S]*?>[\s\S]*?<\/dx-data-grid>/g;
        const dxDataGridRegex =/<dx-tree-list[\s\S]*?>[\s\S]*?<\/dx-tree-list>/g;
        const matches = content.match(dxDataGridRegex);
      console.log(`✔ Found <dx-tree-list> in: ${filePath},${matches}`);
        if (matches) {
            let modifiedContent = content;
    // Najpierw USUWAMY stare <grid-view-toolbar> (przed wstawieniem do toolbar)
            // const gridViewToolbarRegex = /<grid-view-toolbar[\s\S]*?>[\s\S]*?<\/grid-view-toolbar>|<grid-view-toolbar[\s\S]*?\/>/g;
            // if (gridViewToolbarRegex.test(modifiedContent)) {
            //     console.log(`→ Removing old <grid-view-toolbar> tags from: ${filePath}`);
            //     modifiedContent = modifiedContent.replace(gridViewToolbarRegex, '');
            // }
            matches.forEach(match => {
                // Czy w tym <dx-data-grid> jest <dxo-toolbar> ?
                const dxoToolbarRegex = /<dxo-toolbar>([\s\S]*?)<\/dxo-toolbar>/;
                const toolbarMatch = match.match(dxoToolbarRegex);

                if (toolbarMatch) {
                    const toolbarContent = toolbarMatch[1];

                    // Czy nasz item już tam jest?
                    if (!toolbarContent.includes('grid-view-toolbar-item-style')) {
                        const newItem = `
    <dxi-item name="grid-view-toolbar" class="grid-view-toolbar-item-style" locateInMenu="auto">
      <grid-view-toolbar [gridId]="gridId" [getCurrentGridViewConfig]="getCurrentGridViewConfig"
        (setGridViewConfig)="setGridViewConfig($event)"></grid-view-toolbar>
    </dxi-item>`;

                        console.log(`→ Inserting <dxi-item> into <dxo-toolbar> in: ${filePath}`);

                        // Dodajemy na koniec <dxo-toolbar> (przed zamknięciem)
                        const newToolbar = toolbarMatch[0].replace('</dxo-toolbar>', `${newItem}\n</dxo-toolbar>`);

                        // Zamień w całym <dx-data-grid>
                        const newDxDataGrid = match.replace(toolbarMatch[0], newToolbar);

                        // Zamień w całym pliku
                        modifiedContent = modifiedContent.replace(match, newDxDataGrid);
                    }
                } else {
                    console.warn(`⚠ No <dxo-toolbar> found in <dx-data-grid> in file: ${filePath}`);
                }
            });

            // Jeśli coś się zmieniło — zapisz plik
            if (modifiedContent !== content) {
                fs.writeFileSync(filePath, modifiedContent, 'utf-8');
                console.log(`✔ Modified and saved: ${filePath}`);
            }
        } else {
            console.warn(`⚠ No <dx-data-grid> found in file: ${filePath}`);
        }
    }
}

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Sprawdź czy jest <grid-view-toolbar>
    if (content.includes('<grid-view-toolbar')) {
        console.log(`✔ Found <grid-view-toolbar> in: ${filePath}`);

        // Czy w pliku jest <dx-data-grid> z <dxo-toolbar> ?
       // const dxDataGridRegex =/<(dx-data-grid|dx-tree-list)[\s\S]*?>[\s\S]*?<\/\1>/g;// /<dx-data-grid[\s\S]*?>[\s\S]*?<\/dx-data-grid>/g;
        const dxDataGridRegex =/<dx-data-grid[\s\S]*?>[\s\S]*?<\/dx-data-grid>/g;
       // const dxDataGridRegex =/<dx-tree-list[\s\S]*?>[\s\S]*?<\/dx-tree-list>/g;
        const matches = content.match(dxDataGridRegex);
        if (matches) {
            let modifiedContent = content;
    // Najpierw USUWAMY stare <grid-view-toolbar> (przed wstawieniem do toolbar)
            const gridViewToolbarRegex = /<grid-view-toolbar[\s\S]*?>[\s\S]*?<\/grid-view-toolbar>|<grid-view-toolbar[\s\S]*?\/>/g;
            if (gridViewToolbarRegex.test(modifiedContent)) {
                console.log(`→ Removing old <grid-view-toolbar> tags from: ${filePath}`);
                modifiedContent = modifiedContent.replace(gridViewToolbarRegex, '');
            }
            matches.forEach(match => {
                // Czy w tym <dx-data-grid> jest <dxo-toolbar> ?
                const dxoToolbarRegex = /<dxo-toolbar>([\s\S]*?)<\/dxo-toolbar>/;
                const toolbarMatch = match.match(dxoToolbarRegex);

                if (toolbarMatch) {
                    const toolbarContent = toolbarMatch[1];

                    // Czy nasz item już tam jest?
                    if (!toolbarContent.includes('grid-view-toolbar-item-style')) {
                        const newItem = `
    <dxi-item name="grid-view-toolbar" class="grid-view-toolbar-item-style" locateInMenu="auto">
      <grid-view-toolbar [gridId]="gridId" [getCurrentGridViewConfig]="getCurrentGridViewConfig"
        (setGridViewConfig)="setGridViewConfig($event)"></grid-view-toolbar>
    </dxi-item>`;

                        console.log(`→ Inserting <dxi-item> into <dxo-toolbar> in: ${filePath}`);

                        // Dodajemy na koniec <dxo-toolbar> (przed zamknięciem)
                        const newToolbar = toolbarMatch[0].replace('</dxo-toolbar>', `${newItem}\n</dxo-toolbar>`);

                        // Zamień w całym <dx-data-grid>
                        const newDxDataGrid = match.replace(toolbarMatch[0], newToolbar);

                        // Zamień w całym pliku
                        modifiedContent = modifiedContent.replace(match, newDxDataGrid);
                    }
                } else {
                    console.warn(`⚠ No <dxo-toolbar> found in <dx-data-grid> in file: ${filePath}`);
                }
            });

            // Jeśli coś się zmieniło — zapisz plik
            if (modifiedContent !== content) {
                fs.writeFileSync(filePath, modifiedContent, 'utf-8');
                console.log(`✔ Modified and saved: ${filePath}`);
            }
        } else {
            console.warn(`⚠ No <dx-data-grid> found in file: ${filePath}`);
        }
    }
}





// funkcja dla pliku json
// próba odczytania pliku jsnon:
// wygenerowanie pliku jsnon z chat gbt i wpisanie danych do klasy, by móc na jej podstawie operować danymi: 
function walkDirectoryJson(database) {
    const tabelajson = [];
    const dir = __dirname;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isFile() && entry.name === 'temp.json') {
            const filePath = path.join(dir, entry.name);
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            //console.log('Zawartość JSON:', jsonData);

            // Jeśli chcesz iterować po rekordach:
            jsonData.forEach(item => {
                //console.log(`Id: ${item.Id}, source: ${item.source}, target: ${item.target}`);
                tabelajson.push({id: item.Id, source: item.source, target: item.target})
            });
        }
        else
        {
            // console.log(`❌ Nie znalazło pliku: entry name: ${entry.name}`)
        }
    }
    importObjectstoDatabase(tabelajson, database);
}



// funkcja wywołująca
function walkDirectory(dir, database) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
//console.log(`✔ Processing: ${fullPath}`);
        if (entry.isDirectory()) {
            walkDirectory(fullPath, database);
        }
        //  else if (entry.isFile() && fullPath.endsWith('.ts')) {
        //     searchAndReplaceInFile(fullPath);
        // } else if (entry.isFile() && fullPath.endsWith('.xlf')) {
        //     console.log(`✔ Processed XLF file: ${fullPath}`);
        // }
        else if (entry.isFile() && fullPath.endsWith('.html')) {
            console.log(`✔ Processed HTML file: ${fullPath}`);
            //processHtmlFileDxTreeList(fullPath);

            processHtmlFile(fullPath);
            database.searchAndReplace(fullPath);
        }
    }
}

// działania na przykładowej tabeli podanej ręcznie:
// importObjectstoDatabase(tabelaDoTestów, replacements);



// Start

walkDirectoryJson(replacements_for_json);               // dodanie danych z json do klasy
walkDirectory(directoryPath, replacements_for_json);    // zamiana danych w plikach html

// 
// walkDirectory(directoryPath, replacements);
