import {html, positions} from "./data.mjs"
/**
 * Strips the prefix from the keys of the given key-value pairs
 * @param {string} htmlContent - HTML content which needs to be highlighted
 * @param {string} plainText - This plain text is extracted from htmlContent
 * @param {array} plainTextPositions - Array of Objects with start and end positions of words in plainText (Not the positions in HTML)
 * @returns {string} Using the positions in plainText, find the appropriate positions in htmlContent, highlight the content and return it
 */

function highlightHTMLContent(htmlContent, plainText, plainTextPositions) {
    // your logic goes here
    let output = htmlContent
    let count = 0
    plainTextPositions.map(value => {
        // Extracts the particular substring from the plain text whose position is given in the array.
        let subStr = plainText.substring(value.start + 1, value.end + 1)
        // Made a highlight template to replace the said substring.
        let highlight = `<mark>${subStr}</mark>`
        // Gets the index of all the words in the html content that matches the substring.
        let indexes = [...htmlContent.matchAll(new RegExp(subStr, 'gi'))].map(idx => idx.index)
        // Subtracts the positions in htmlContent from that of plainText to find the distance between words.
        let bestMatchArray = indexes.map((bm) => Math.abs(bm - value.start))
        // Gets the minimum element from the new array to decide which substring word in htmlContent will be the closest to the substring word in plaintext.
        let bestMatch = Math.min.apply(null,bestMatchArray)
        // Gets the index of that minimum element
        let bestMatchIndex = bestMatchArray.indexOf(bestMatch)
        // Calls a function that replaces the substring in htmlContent with the highlight template made above.
        output = replaceRange(output, indexes[bestMatchIndex] + count, indexes[bestMatchIndex] + subStr.length + count, highlight)
        // Increases the count to compensate for the added tags in htmlContent.
        count = count + highlight.length - subStr.length
    })
    return output
}

// This function replace the substring within the range(start, end) with the specified substitute
function replaceRange(s, start, end, substitute) {
    return s.substring(0, start) + substitute + s.substring(end);
}

// This function extracts the plain text from the html content by replacing all the tags with white spaces.
function extractHTML(htmlContent) {
    let res = htmlContent.replace(/<(?:.|\n)*?>/gm, " ");
    res = res.replace(/\s\s+/g, ' ')
    return res
}

const plainText = extractHTML(html)
const output = highlightHTMLContent(html, plainText, positions)
console.log(output)
