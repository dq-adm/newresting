const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const categories = [
    "AI",
    "Bug Bounty",
    "Defensive Security",
    "Fundamentals Modules",
    "Penetration Testing"
];

const modulesData = {};

categories.forEach(category => {
    const categoryPath = path.join(rootDir, category);
    if (fs.existsSync(categoryPath) && fs.lstatSync(categoryPath).isDirectory()) {
        modulesData[category] = [];
        const items = fs.readdirSync(categoryPath);
        
        items.forEach(item => {
            const itemPath = path.join(categoryPath, item);
            if (fs.lstatSync(itemPath).isDirectory()) {
                // Check for index.html directly in the module folder
                const indexPath = path.join(itemPath, 'index.html');
                
                if (fs.existsSync(indexPath)) {
                    modulesData[category].push({
                        name: item,
                        path: `${category}/${item}/index.html`
                    });
                } else {
                    // Start recursive check if not found immediately
                    // Some modules might have it deeper? For now simple check.
                    // Let's check 'modules' folder if it exists as seen in one ls output
                    const subDirPath = path.join(itemPath, 'modules'); // hypothetical
                     if (fs.existsSync(subDirPath) && fs.lstatSync(subDirPath).isDirectory()) {
                         // Ignoring deep search for now to keep it flat unless needed
                     }
                }
            }
        });
    }
});

const outputPath = path.join(rootDir, 'modules_data.js');
const fileContent = `window.htbModules = ${JSON.stringify(modulesData, null, 2)};`;

fs.writeFileSync(outputPath, fileContent);
console.log('Successfully generated modules_data.js');
console.log(JSON.stringify(modulesData, null, 2));
