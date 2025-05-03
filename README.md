# Unicode Character Analyzer

A single-page web application that helps you detect and clean invisible or unusual Unicode characters from text.

## Features

- **Detect Invisible Characters**: Identifies non-breaking spaces, zero-width characters, byte order marks, and other invisible Unicode characters.
- **Visual Highlighting**: Shows all detected characters with their Unicode codes and highlights them for easy identification.
- **Cleaned Output**: Provides a clean version of the text with all special characters removed.
- **Character Statistics**: Displays the total count of invisible characters detected in the text.
- **Client-Side Operation**: No server requests - everything runs in your browser.

## How to Use

1. Open `index.html` in any modern web browser.
2. Paste or type your text in the "Input Text" area.
3. Click the "Analyze Text" button (or wait for automatic analysis).
4. View the highlighted characters in the "Character Analysis" section.
5. See the cleaned text in the "Cleaned Text" section.
6. Use the "Copy to Clipboard" button to copy the cleaned text.
7. Click "Clear All" to reset all fields.

## Characters Detected

The application detects the following types of invisible or special Unicode characters:

- Non-breaking spaces (U+00A0)
- Zero-width characters (U+200B, U+200C, U+200D, U+2060)
- Byte Order Mark (U+FEFF)
- Various space characters (En, Em, Hair, etc.)
- Directional formatting characters
- And many more (see full list in the code)

## Technical Implementation

This application is built with pure HTML, CSS, and JavaScript without any external libraries. It works by:

1. Parsing the input text character by character
2. Checking each character against a predefined list of special Unicode characters
3. Highlighting detected characters while building a clean version of the text
4. Updating the UI with the results

## Browser Compatibility

Works in all modern browsers that support ES6 JavaScript.

## License

Feel free to use, modify, and distribute this application as needed. 