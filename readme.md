# Unpopup

An alternative to popups.

## Installation

Download the script [here](https://github.com/LeeKevin/unpopup/blob/master/dist/unpopup.js) and include it on your webpage:

    <script src="/path/to/unpopup.js"></script>
    
**Do not include the script directly from GitHub (http://raw.github.com/...).** The file is being served as text/plain and as such being blocked
in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

## Usage

1. Add the class `unpopup` to the element that you'd like to convert.
2. Give that element a unique `id`
3. Enjoy!

Unpopup will create a background overlay to bring the element into focus and display a "close" icon. "Closing" the unpopup element will create a
cookie that will prevent the unpopup from being shown again to the same user for the next week.

# Build & Development

1. `npm install`
2. Edit configuration or code in `src/`
3. `npm run build`