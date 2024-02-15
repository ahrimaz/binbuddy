const fs = require('fs');
const readline = require('readline');
const copyPaste = require('copy-paste');

console.log('welcome to binbuddy! enter your working folder to collect the bin numbers from the file names.');
console.log('the bin numbers collected will be automatically placed in your clipboard for easy pasting.');
console.log('');
console.log('\x1b[31mto paste into this application, simply right click into the window.\x1b[0m');
console.log('\x1b[31malternatively, use CTRL+SHIFT+V\x1b[0m');
console.log('');
console.log('if you encounter any errors or have any questions, contact eric s')
console.log('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function extractDigits(directoryPath) {
  if (!fs.existsSync(directoryPath) || !fs.lstatSync(directoryPath).isDirectory()) {
    console.error('\x1b[31mInvalid directory path.\x1b[0m'); // Red text
    return;
  }

  const files = fs.readdirSync(directoryPath);
  const regex = /--(\d{1,4})|__(\d{1,4})/

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
    const result = uniqueDigits.join(','); // Green text
    console.log('\x1b[33mResult copied to clipboard for copy paste.\x1b[0m'); // Yellow text
    console.log(result);

    // Copy result to clipboard
    copyPaste.copy(result, () => {
        console.log(' ');
    });
  } else {
    console.log('\x1b[33mNo unique digits found in filenames.\x1b[0m'); // Yellow text
  }
}

function promptForDirectory() {
  rl.question('\x1b[36mEnter the directory path (or type \x1b[31mexit\x1b[36m to quit): \x1b[0m', (directoryPath) => {
    if (directoryPath.toLowerCase() === 'exit') {
      rl.close();
    } else {
      extractDigits(directoryPath);
      console.log(); // Add a new line here
      promptForDirectory();
    }
  });
}

promptForDirectory();
