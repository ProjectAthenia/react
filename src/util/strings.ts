/**
 * This function will take in a string of text, calculate where to cut it based on white space and the length,
 * and then add an ellipsis sign if one is passed through.
 * @param text
 * @param length
 * @param ellipsisSign
 */
export function ellipsisText(text: string, length: number, ellipsisSign?: string): string
{
    if (!text) {
        return '';
    }

    if (length > text.length) {
        return text;
    }

    const stripped = text.replace(/(<([^>]+)>)/gi, "");

    const cutString = stripped.substring(0, length);
    const reversed = cutString.split("").reverse().join("")
    const lastSpaceIndex = length - reversed.indexOf(' ') - 1;

    const returningString = stripped.substring(0, lastSpaceIndex);
    return returningString.replace(/([.,\/#!$%\^&\*;:{}=\-_`~()\]\[])+$/g, "") + (ellipsisSign ? ellipsisSign : '');
}

/**
 * This function will take in an array of strings of text, calculate how to concatenate them into a list,
 * and then return the grammatically correct list
 * @param listItems
 */
export function grammaticalList(listItems: string[]): string
{
    let list = ''
    if( listItems.length < 3 ) {
        list = listItems.join(' and ')
    }
    else {
        let lastItem = listItems.splice(listItems.length-1)
        list = listItems.join( ', ' ) + ', and ' + lastItem
    }
    return list
}

/**
 * This function will take in a string of text, and prefix it with http://
 * if the http header is missing from the string
 * @param url
 */
export function addHttpPrefix(url: string): string
{
    const trimmedURL = url.trim()
    if (trimmedURL.length == 0) {
        return '';
    }
    const validHttp = trimmedURL.startsWith('http')

    if(!validHttp && trimmedURL.indexOf('://') > -1 ) {
        let replacer = 'http://'
        if( trimmedURL.indexOf('s://') > -1 ) {
            replacer = 'https://'
        }
        return trimmedURL.replace( /((.|[\n\r])*):\/\//g, replacer )
    }

    return (!validHttp ? 'http://' : '') + trimmedURL
}

/**
 * This function will take in a hex color string, and return it's brightness on a scale of 0 to 255
 * Calcuation Reference: https://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.709-6-201506-I!!PDF-E.pdf
 * Author of Reference: International Telecommunication Union – Radiocommunication Sector
 * Document Title: Parameter values for the HDTV standards for production and international programme exchange, Page 4, Item 3.2
 * @param color
 */
export function convertHexColorToBrightness(color: string): number
{
    const RBGColor = parseInt(color.substring(1), 16)
    const r = (RBGColor >> 16) & 0xff
    const g = (RBGColor >>  8) & 0xff
    const b = (RBGColor >>  0) & 0xff

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Passes back initials for whatever was passed in
 * @param name
 */
export function initialize(name: string): string
{
    const nameParts = name.split(' ');

    if (nameParts.length > 0) {
        const initials = nameParts.shift()!.charAt(0) + (nameParts.length > 1 ? nameParts.pop()!.charAt(0) : '');
        return initials.toUpperCase();
    }

    return "";
}
