const { count } = require('console');
const fs = require('fs');
const path = require('path');
const { from } = require('rxjs');
const directoryPath = path.resolve(__dirname, '../../src'); // Ensure the path is correct

// Szukanie klas:
// zrobić skrypt który:
// znajdzie coś na zasadzie:
// ${nazwa_klasy_podana_przezdeva}.property
// w każdym z plików i zwróci:
// tabelę obieków:
// {klasa}.property - wsytępuję w pliku: plik.ts/.html   |   wsytępuje w linijce:  {linijka jaką znajdzie}

// przykładowy regex: \b(VehiclesPermission)\b[.]+([a-zA-Z0-9\-]+)\b

class ClassesandProperties {
    className;
    property;
    localization;

    full_property;

    constructor(Class, property, lineNumber){
        this.className = Class,
        this.property = property,
        this.localization = lineNumber

        this.full_property = `${this.className}.${this.property}`
    }
}

class Database {
    db = []

    constructor(){
    }

    addtoDatabase(obiekt){
        this.db.push(obiekt)
    }

    searchThroughTable(nameOfClass){
        let licznik

        this.db.forEach(element => {
           if(nameOfClass == element.className){
            console.log(`🌸 Szukana klasa: ${nameOfClass}`)
            licznik++
           } 
        });
        console.log(`\n🌸 Ilość wystąpień properties tej klasy: ${licznik}`)

    }

}



let searchedClass = 'UserPermission'
let databasewithClasses = new Database();
let zmienna = new RegExp(
    `\\bSomething\\b`
)

function searchClasses(filePath, some_regex, name_of_class){
    let content = fs.readFileSync(filePath, 'utf-8');
    let results;
    
    let regex_re  = new RegExp(
        `\\b(${some_regex})\\b[.]+([a-zA-Z0-9\\-]+)\\b`,
        'g'
    );

    let regex_sc = new RegExp(
        `\\b(${name_of_class})\\b[.]+([a-zA-Z0-9\\-]+)\\b`,
        'g'
    ); 

    
    let regex;
    if(some_regex != undefined || some_regex != ""){
        regex = regex_re;
    }
    else if(name_of_class != undefined || name_of_class != ""){
        regex = regex_sc;
    }
    
    
    results = [...content.matchAll(regex)];
    let szukanaklasa

    if(regex.test(content))
    {
        console.log(`\n✅ W pliku ${filePath} występuje klasa ${name_of_class}`);
        results.forEach((match) => {
            const [_, Class, property] = match;

            const index = match.index;
            const linesUpToMatch = content.slice(0, index).split('\n');
            const lineNumber = linesUpToMatch.length; // linie liczymy od 1

            console.log(`Klasa: ${Class} | Property: ${property} | Linia w której wysepuje: ${lineNumber}`);
            szukanaklasa = new ClassesandProperties(Class, property, lineNumber);
            databasewithClasses.addtoDatabase(szukanaklasa);

        });
        console.log(`\n`)
        
    }

    else
    {
        console.log("❌ Nie znaleziono klasy w pliku");
    }
}

if (!fs.existsSync(directoryPath)) {
    console.error(`❌ Directory does not exist: ${directoryPath}`);
    process.exit(1); // Exit the script with an error code
}

function walkDirectory(dir, searchedRegex, nameOfClass) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        //console.log(`✔ Processing: ${fullPath}`);
        if (entry.isDirectory()) {
            walkDirectory(fullPath, searchedRegex, nameOfClass);      // rekurencja (ZAWSZE TO CO JEST DANE TEŻ W FUNKCJI)
        }
        else if (entry.isFile() && fullPath.endsWith('.ts')) {
            console.log(`✔ Processed TS file: ${fullPath}`);
            searchClasses(fullPath, searchedRegex, nameOfClass);
        }

        else if (entry.isFile() && fullPath.endsWith('.html')) {
            console.log(`✔ Processed HTML file: ${fullPath}`);
            searchClasses(fullPath, searchedRegex, nameOfClass);
        }
    }
}


walkDirectory(directoryPath, zmienna, searchedClass)