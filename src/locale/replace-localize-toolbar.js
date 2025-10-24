const fs = require('fs');
const path = require('path');
//const { DOMParser, XMLSerializer } = require('xmldom'); //npm install xmldom --legacy-peer-deps
const directoryPath = path.resolve(__dirname, '../../src'); // Ensure the path is correct

// fronm    -   text that you want to change
// to       -   to text you want your original text to change
// id       -   id of i18n attribute
// taginfo  -   the tag you want to change in i18n-example (so here taginfo will be the i18n-{taginfo})

// id = ''                  - id generowane automatycznie
// id = '{some_text_here}'  - customowe id











const replacements = [
  { from: '1', to: 'samochód', id: '', taginfo: '', isnewId: false},
  { from: '2', to: 'samojezdny pojazd :>', id: 'bratek', taginfo: '', isnewId: false},
  { from: '3', to: 'samojezdny pojazd :>', id: 'bra tek', taginfo: '', isnewId: false},
  { from: '4', to: 'Pociąg :D', id: 'something', taginfo: '', isnewId: false},

  // i18n-
  { from: '5', to: 'Samolocik Hue Hue Hue', id: 'someID', taginfo: 'text', isnewId: false},
  { from: '6', to: 'To jest Tag bez id :D', id: '', taginfo: 'text', isnewId: false},
  { from: 'title', to: 'To Title Tag bez id :)', id: '', taginfo: 'title', isnewId: false},

  
  { from: 'some title here', to: 'tile hehehe', id: '', taginfo: 'title', isnewId: false},




   { from: 'soemmthing', to: 'sample', id: '', taginfo: 'title', isnewId: false}


  //something
  
];


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


// i18n
function searchAndReplace(filePath){
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;
    
    // WAŻNE: Gdy coś nie działa, wina html. Naprawić można to zmieniając html (najłątwiejsze), bądź regexa (nie)
    replacements.forEach(({ from, to, id, taginfo, isnewId }) => {
 
        const isId = "";
        const isTag = "";

        let istrue;
        let tagtrue;
        // isId == id
        // ? istrue = false
        // : istrue = true;

        // inny zapis
        istrue = isId != id;
        tagtrue = isTag != taginfo;

        console.log(`Podane id: ${id}`);
        console.log(`Podany tag: ${taginfo}`);
        // console.log(`Czy ma id: ${istrue}`)
        // console.log(`Czy ma tag: ${tagtrue}`);
        
        let searchedRegex

        // do regex'a:
        // lookahead => (?!) nie może być po tym, (?=) musi być po tym
        
        // i18n
        if(taginfo == false){
        istrue == true
        ? searchedRegex = new RegExp(
        `(<(\\w+|\\w+-\\w+)\\s[^>]*\\bi18n\\b\\s*(?!-)=\\s*(['"])[^"'>]*@@${id}\\b(?:\\|[^"'>]*)?\\3[^>]*>)` + 
        `(${from})` +                          
        `(<\\/\\2>)`,                                      
        'g'     
        )
        : searchedRegex = new RegExp(
        `(<(\\w+|\\w+-\\w+)\\s[^>]*` +                     // rozpoczęcie tagu
        `\\bi18n\\b(?!-)\\s*` +             // i18n, nie może wystąpić znak "-"
        `(?:` + // grupy jakie będziemy sprawdzać:
        // grupa 1: nie ma znaku równa się
        `(?:(?!=)[^>]*>)` +
        `|` + // znak lub
        // grupa 2: występuje znak równa się
        `(?:=\\s*(['"])[^"'@>]*\\3[^>]*>)` +  
        `))`+    //zamknięcie grupy spawdzającej     
        `(${from})` +                               // grupa przechwytująca tylko tekst wewnątrz tagu
        `(<\\/\\2>)`,                      // zamknięcie tagu
        'g'
        );
        }
        //============================================================================================


        // i18n-  DONE
        else{
        istrue == true
        ? searchedRegex = new RegExp(
        `(<(\\w+|\\w+-\\w+)\\s[^>]*\\bi18n-\\b${taginfo}\\s*=\\s*(['"])[^"'>]*@@${id}\\b(?:\\|[^"'>]*)?\\3[^>]*` + 
        `${taginfo}=(['"]))(${from})` +
        `(\\4[^>]*>` +     
        `(?:(?!<\\/\\2>)[\\s\\S])*` +                    
        `<\\/\\2>)`,                                      
        'g'     
        )
        : searchedRegex = new RegExp(
        `(<(\\w+|\\w+-\\w+)\\s[^>]*` +
        `\\bi18n-\\b${taginfo}\\s*` +
        `(?:` +
        `(?:(?!=)[^>]*${taginfo})` +
        `|` + 
        `(?:=\\s*(['"])[^"'@>]*\\3[^>]*${taginfo})` +  
        `)`+
        `=(['"]))` +   
        `(${from})` + 
        `(\\4[^>]*>` +
        `(?:(?!<\\/\\2>)[\\s\\S])*` +                              
        `<\\/\\2>)`,                     
        'g'
        );  

        // (<(\w+|\w+-\w+)\s[^>]*\bi18n-\btitle\s*(?:(?:(?!=)[^>]*title)|(?:=\s*(['"])[^"'@>]*\3[^>]*title))=(['"]))(some title here)(\4[^>]*>(?:(?!<\/\2>)[\s\S])*<\/\2>)
          



        }
        function replace(sampleregex, from, to, ThereIsTag){
            if(sampleregex.test(content))
            {
                // "rest" here is a grouop needed for regex to close this: "". 
                // It is inside a group ONLY for regex to read and finish, not 
                // significant for later code(the return you get)

                // console.log(`Regex znaleziony`, sampleregex)
                if (ThereIsTag == false)
                {
                content = content.replace(sampleregex, (_, opentag, nameoftag, rest, inner, closetag) => {

                    console.log(`Tag: ${opentag}   Inner: ${inner}   Close-Tag: ${closetag}`);
                    const newInner = inner.split(from).join(to);

                    return `${opentag}${newInner}${closetag}`;
                });
                }
                else
                {
                content = content.replace(sampleregex, (_, opentag, nameoftag, rest, secondrest, inner, closetag) => {

                    console.log(`Tag: ${opentag}   Inner: ${inner}   Close-Tag: ${closetag}`);
                    const newInner = inner.split(from).join(to);

                    return `${opentag}${newInner}${closetag}`;
                });
                }
                changed = true;
                console.log(`Znalazło plik`,to)
            }  
        }

        // funkcje tera na zmianę id...
        let searchedRegexforId
        // (\bi18n\b(?!-)(=(["'\`])(?:(?!\3)[^>]*)@@)(CustomId)\b)((?:(?!\3)[^>]*)?\3[^>]*>(auto))<
        
        // i18n

        searchedRegexforId = new RegExp(
            `(\\bi18n\\b(?!-)=(["'\`])(?:(?!\\2)[^>]*)@@(${id})\\b(?:(?!\\2)[^>]*)?\\2[^>]*>)(${from})<`
        )
        
        
        

        // wywoływanie funkcji
        replace(searchedRegex, from, to, taginfo)
       

        
    })


    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✔ Zmieniono w: ${filePath}`);
    }

    else {
        console.log(`❌ Nie znaleziono`)
    }


}

//regexy

// literalne:   [^>]*\b...\b[^>]*
// stringowe:   `[^>]*\\b...\\b[^>]*`




// i18n-



// funkcja wywołująca

function walkDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
//console.log(`✔ Processing: ${fullPath}`);
        if (entry.isDirectory()) {
            walkDirectory(fullPath);
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
            searchAndReplace(fullPath);
        }
    }
}




// Start
walkDirectory(directoryPath);
