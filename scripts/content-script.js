// To Do
// 1. Create a popup html and js and interact with content script to modify the width, font type and font size maybe.
// 2. Improve the back button experience. 

const url = window.location.href;
const allAnchorTags = document.querySelectorAll('a');
let filteredAnchorTagIds = [];

for (let i = 0; i < allAnchorTags.length; i++) {
    const currTag = allAnchorTags[i];
    const currTagUrl = currTag.href;

    if (currTagUrl && currTagUrl.includes(url) && currTagUrl.includes("#")) {
        filteredAnchorTagIds.push(currTag);
    }
}

for (let i = 0; i < filteredAnchorTagIds.length - 1; i++) {
    let currTag = filteredAnchorTagIds[i];
    let nextTag = filteredAnchorTagIds[i+1];

    let currTagUrl = currTag.href;
    let nextTagUrl = nextTag.href;

    let currFootNoteId = currTagUrl.substring(currTagUrl.indexOf("#")).substring(1);
    let currFootNoteElement = document.getElementsByName(currFootNoteId)[0];

    let nextFootNoteId = nextTagUrl.substring(nextTagUrl.indexOf("#")).substring(1);
    let nextFootNoteElement = document.getElementsByName(nextFootNoteId)[0];

    let content = getContentBetweenTags(currFootNoteElement, nextFootNoteElement);

    addToolTipForTheCurrentTag(currTag, content);
    addGoBackUpAnchor(currFootNoteElement, currTag);
}

// Handling the edge case.
if (Boolean(filteredAnchorTagIds)) {
    let lastAnchorTag = filteredAnchorTagIds[filteredAnchorTagIds.length - 1];
    let lastTagUrl = lastAnchorTag.href;
    let lastFootNoteId = lastTagUrl.substring(lastTagUrl.indexOf("#")).substring(1);
    let lastFootNoteElement = document.getElementsByName(lastFootNoteId)[0];
    let lastElement = getLastElementInThePage();

    let content = getContentBetweenTags(lastFootNoteElement, lastElement);
    addToolTipForTheCurrentTag(lastAnchorTag, content);
    addGoBackUpAnchor(lastFootNoteElement, lastAnchorTag);
}

function getLastElementInThePage() {
    const allFontElements = document.querySelectorAll('font');
    for (const fontEle of allFontElements) {
        if (fontEle.color == "888888") {
            return fontEle;
        }
    }
}

function addToolTipForTheCurrentTag(currentTag, toolTipContent) {
    let spanElementForToolTipContent = document.createElement('span');
    spanElementForToolTipContent.classList.add("tooltiptext");
    spanElementForToolTipContent.innerHTML = toolTipContent;

    currentTag.appendChild(spanElementForToolTipContent);
    currentTag.classList.add("tooltip");
}

function addGoBackUpAnchor(footNoteElement, currentTag) {
    let currentTagName = currentTag.name;
    let curretTagUrl = currentTag.href;
    let currentFootNoteName = curretTagUrl.substring(curretTagUrl.indexOf("#")).substring(1);
    if (!currentTagName) {
        currentTagName = currentFootNoteName + 'f';
    } else {
        return;
    }

    currentTag.setAttribute('name', currentTagName);
    currentTagName = "#" + currentTagName;
    footNoteElement.href = url + currentTagName;

    let goBackUpAnchor = document.createElement('a');
    goBackUpAnchor.href = url + currentTagName;
    goBackUpAnchor.innerHTML = "^";
    footNoteElement.previousSibling.before(goBackUpAnchor);
}

function getContentBetweenTags(startElement, endElement) {
    let content = '';
    let currentElement = startElement.nextSibling;

    while (currentElement && currentElement !== endElement) {
        content += currentElement.textContent.trim() + ' ';
        currentElement = currentElement.nextSibling;
    }

    // removing [ and ] from the string.
    content = content.substring(1);
    content = content.slice(0, -2);

    return content;
}

(function addSmoothScroll() {
    const style = document.createElement('style');
    style.textContent = 'html { scroll-behavior: smooth; }';
    document.head.appendChild(style);
})();
