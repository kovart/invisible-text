document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const highlightedText = document.getElementById('highlighted-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const statsCount = document.getElementById('stats-count');

    // List of invisible or special Unicode characters to detect
    // This includes non-breaking spaces, zero-width characters, byte order marks, and others
    const specialCharacters = {
        '\u00A0': 'U+00A0', // Non-breaking space
        '\u200B': 'U+200B', // Zero-width space
        '\u200C': 'U+200C', // Zero-width non-joiner
        '\u200D': 'U+200D', // Zero-width joiner
        '\u2060': 'U+2060', // Word joiner
        '\uFEFF': 'U+FEFF', // Byte Order Mark
        '\u180E': 'U+180E', // Mongolian vowel separator
        '\u2000': 'U+2000', // En quad
        '\u2001': 'U+2001', // Em quad
        '\u2002': 'U+2002', // En space
        '\u2003': 'U+2003', // Em space
        '\u2004': 'U+2004', // Three-per-em space
        '\u2005': 'U+2005', // Four-per-em space
        '\u2006': 'U+2006', // Six-per-em space
        '\u2007': 'U+2007', // Figure space
        '\u2008': 'U+2008', // Punctuation space
        '\u2009': 'U+2009', // Thin space
        '\u200A': 'U+200A', // Hair space
        '\u202F': 'U+202F', // Narrow no-break space
        '\u205F': 'U+205F', // Medium mathematical space
        '\u3000': 'U+3000', // Ideographic space
        '\u2028': 'U+2028', // Line separator
        '\u2029': 'U+2029', // Paragraph separator
        '\u061C': 'U+061C', // Arabic letter mark
        '\u200E': 'U+200E', // Left-to-right mark
        '\u200F': 'U+200F', // Right-to-left mark
        '\u202A': 'U+202A', // Left-to-right embedding
        '\u202B': 'U+202B', // Right-to-left embedding
        '\u202C': 'U+202C', // Pop directional formatting
        '\u202D': 'U+202D', // Left-to-right override
        '\u202E': 'U+202E', // Right-to-left override
        '\u2066': 'U+2066', // Left-to-right isolate
        '\u2067': 'U+2067', // Right-to-left isolate
        '\u2068': 'U+2068', // First strong isolate
        '\u2069': 'U+2069'  // Pop directional isolate
    };
    
    // Map special characters to their simplified alternates
    const simplifiedReplacements = {
        '\u00A0': ' ',      // Non-breaking space → Regular space
        '\u200B': '',       // Zero-width space → Remove
        '\u200C': '',       // Zero-width non-joiner → Remove
        '\u200D': '',       // Zero-width joiner → Remove
        '\u2060': '',       // Word joiner → Remove
        '\uFEFF': '',       // Byte Order Mark → Remove
        '\u180E': '',       // Mongolian vowel separator → Remove
        '\u2000': ' ',      // En quad → Regular space
        '\u2001': ' ',      // Em quad → Regular space
        '\u2002': ' ',      // En space → Regular space
        '\u2003': ' ',      // Em space → Regular space
        '\u2004': ' ',      // Three-per-em space → Regular space
        '\u2005': ' ',      // Four-per-em space → Regular space
        '\u2006': ' ',      // Six-per-em space → Regular space
        '\u2007': ' ',      // Figure space → Regular space
        '\u2008': ' ',      // Punctuation space → Regular space
        '\u2009': ' ',      // Thin space → Regular space
        '\u200A': ' ',      // Hair space → Regular space
        '\u202F': ' ',      // Narrow no-break space → Regular space
        '\u205F': ' ',      // Medium mathematical space → Regular space
        '\u3000': ' ',      // Ideographic space → Regular space
        '\u2028': '\n',     // Line separator → Newline
        '\u2029': '\n\n',   // Paragraph separator → Double newline
        '\u061C': '',       // Arabic letter mark → Remove
        '\u200E': '',       // Left-to-right mark → Remove
        '\u200F': '',       // Right-to-left mark → Remove
        '\u202A': '',       // Left-to-right embedding → Remove
        '\u202B': '',       // Right-to-left embedding → Remove
        '\u202C': '',       // Pop directional formatting → Remove
        '\u202D': '',       // Left-to-right override → Remove
        '\u202E': '',       // Right-to-left override → Remove
        '\u2066': '',       // Left-to-right isolate → Remove
        '\u2067': '',       // Right-to-left isolate → Remove
        '\u2068': '',       // First strong isolate → Remove
        '\u2069': ''        // Pop directional isolate → Remove
    };

    // Sample text with invisible characters for testing
    const sampleTextBtn = document.createElement('button');
    sampleTextBtn.textContent = 'Load Sample Text';
    sampleTextBtn.id = 'sample-btn';
    sampleTextBtn.classList.add('secondary-btn');
    document.querySelector('.button-group').appendChild(sampleTextBtn);

    // Function to load sample text with invisible characters
    function loadSampleText() {
        // Create a sample text with various invisible characters for demo purposes
        const sample = `This text contains various invisible Unicode characters that will be replaced:
1. Here is a non-breaking space (U+00A0): "Hello${'\u00A0'}World" → Will be replaced with regular space
2. Here is a zero-width space (U+200B): "Difficult${'\u200B'}Word" → Will be removed
3. Here is a line separator (U+2028): "First line${'\u2028'}Second line" → Replaced with newline
4. Here is a paragraph separator (U+2029): "Paragraph 1${'\u2029'}Paragraph 2" → Replaced with double newline
5. Here are multiple special spaces: "Too${'\u2000'}${'\u2001'}${'\u2002'}many${'\u200B'}spaces"
6. Here is a byte order mark (U+FEFF): "${'\uFEFF'}Hidden BOM" → Will be removed

Try copying this text to see how the special characters are replaced!`;
        
        inputText.value = sample;
        analyzeText();
    }

    // Function to analyze text and highlight special characters
    function analyzeText() {
        const text = inputText.value;
        let highlightedHTML = '';
        let cleanedText = '';
        let count = 0;
        let replacedCount = 0;

        // Process the text character by character
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const code = specialCharacters[char];
            const replacement = simplifiedReplacements[char];

            if (code) {
                // This is a special character
                highlightedHTML += `<span class="highlighted-char" title="Replaced with: '${replacement === '' ? 'removed' : replacement}'">${code}</span>`;
                
                // Add the replacement character to cleaned text
                cleanedText += replacement;
                count++;
                
                // Count characters that were actually replaced with something (not just removed)
                if (replacement !== '') {
                    replacedCount++;
                }
            } else {
                // This is a regular character
                cleanedText += char;
                
                // Escape HTML special characters for display
                const escapedChar = escapeHTML(char);
                highlightedHTML += escapedChar;
            }
        }

        // Update the UI
        highlightedText.innerHTML = highlightedHTML;
        outputText.value = cleanedText;
        statsCount.textContent = count;
        
        // Update the character analysis status display - simplified
        document.getElementById('stats-display').innerHTML = 
            `<span id="stats-count">${count}</span> invisible/special characters detected`;
              
        // Update the processed text status display - with detailed counts
        document.getElementById('replaced-stats').textContent = replacedCount;
        document.getElementById('removed-stats').textContent = count - replacedCount;
    }

    // Escape HTML characters to prevent XSS
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Function to clear all input and output
    function clearAll() {
        inputText.value = '';
        outputText.value = '';
        highlightedText.innerHTML = '';
        statsCount.textContent = '0';
        
        // Reset the status displays to match their simplified/detailed formats
        document.getElementById('stats-display').innerHTML = 
            '<span id="stats-count">0</span> invisible/special characters detected';
        document.getElementById('replaced-stats').textContent = '0';
        document.getElementById('removed-stats').textContent = '0';
    }

    // Function to copy the cleaned text to clipboard
    function copyToClipboard() {
        // Use the modern Clipboard API if available, fall back to the older method if not
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(outputText.value)
                .then(() => {
                    // Visual feedback for the copy action
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 1500);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        } else {
            // Fallback for older browsers
            outputText.select();
            document.execCommand('copy');
            
            // Visual feedback for the copy action
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 1500);
        }
    }

    // Handle paste events directly on the input field
    inputText.addEventListener('paste', () => {
        // Use setTimeout to let the paste event complete
        setTimeout(analyzeText, 0);
    });

    // Add event listeners
    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyToClipboard);
    sampleTextBtn.addEventListener('click', loadSampleText);
    
    // Optional: analyze text on input changes (with debounce for performance)
    let debounceTimer;
    inputText.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(analyzeText, 500);
    });
}); 