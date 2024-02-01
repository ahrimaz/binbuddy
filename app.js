const fs = require('fs');
const readline = require('readline');
const copyPaste = require('copy-paste');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('welcome to binbuddy! enter your working folder to collect the bin numbers from the file names.');
console.log('the bin numbers collected will be automatically placed in your clipboard for easy pasting.');
console.log('');
console.log('if you encounter any errors or have any questions, contact eric s')
console.log('');

function extractDigits(directoryPath) {
  if (!fs.existsSync(directoryPath) || !fs.lstatSync(directoryPath).isDirectory()) {
    console.error('Invalid directory path.');
    return;
  }

  const files = fs.readdirSync(directoryPath);
  const regex = /--(\d{4})|__(\d{4})/;

  const uniqueDigitsSet = new Set();

  files.forEach(file => {
    const match = file.match(regex);

    if (match) {
      const digit = match[1] || match[2];

      if (digit && !uniqueDigitsSet.has(digit)) {
        uniqueDigitsSet.add(digit);
      }
    }
  });

  const uniqueDigits = Array.from(uniqueDigitsSet);
  if (uniqueDigits.length > 0) {
    const result = uniqueDigits.join(',');
    console.log(result);

    // copy to clipboard
    copyPaste.copy(result, () => {
    });
    console.log(' ');
  }
}

function promptForDirectory() {
  rl.question('Enter the directory path (or type "exit" to quit): ', (directoryPath) => {
    if (directoryPath.toLowerCase() === 'exit') {
      rl.close();
    } else {
      extractDigits(directoryPath);
      promptForDirectory();
    }
    console.log('');
  });
}

promptForDirectory();
