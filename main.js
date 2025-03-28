const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
    .requiredOption('-i, --input <path>', 'Input file path')
    .option('-o, --output <path>', 'Output file path')
    .option('-d, --display', 'Display result in console');

program.parse(process.argv);

const options = program.opts();

if (!options.input) {
    console.error("Please, specify input file");
    process.exit(1);
}

const inputFilePath = path.resolve(options.input);

if (!fs.existsSync(inputFilePath)) {
    console.error("Cannot find input file");
    process.exit(1);
}

try {
    const data = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));
    const categories = ["Доходи, усього", "Витрати, усього"];

    const results = data
        .filter(item => categories.includes(item.category))
        .map(item => `${item.category}:${item.value}`)
        .join('\n');

    if (options.output) {
        fs.writeFileSync(path.resolve(options.output), results, 'utf-8');
    }

    if (options.display) {
        console.log(results);
    }
} catch (error) {
    console.error("Error reading or processing input file:", error.message);
    process.exit(1);
}
