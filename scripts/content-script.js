/**
 * To Do
 * 1. Add tooltips to the go back up anchor.
 * 2. Improve back button experience.
 * 3. Make the toolbar responsive for all the screen sizes.
 * 4. Fix the bug in index.html.
 * 5. Include elements in the toolbar/popup.html to increase font size.
 * 6. Enable the option to reset the whole page to default, leaving only the footnotes experience. 
 * 7. Make the tool-tip view dynamic based on the page availability.
 */

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

// Adding tool-tips to the footnotes.
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
if (filteredAnchorTagIds.length > 0) {
    let lastAnchorTag = filteredAnchorTagIds[filteredAnchorTagIds.length - 1];
    let lastTagUrl = lastAnchorTag.href;
    let lastFootNoteId = lastTagUrl.substring(lastTagUrl.indexOf("#")).substring(1);
    let lastFootNoteElement = document.getElementsByName(lastFootNoteId)[0];
    let lastElement = getLastElementInThePage();

    let content = getContentBetweenTags(lastFootNoteElement, lastElement);
    addToolTipForTheCurrentTag(lastAnchorTag, content);
    addGoBackUpAnchor(lastFootNoteElement, lastAnchorTag);
}

(function addSmoothScroll() {
    const style = document.createElement('style');
    style.textContent = 'html { scroll-behavior: smooth; }';
    document.head.appendChild(style);
})();

let fetchContent = (mainContentTable) => {
    let content = document.createElement('div');
    mainContentTable = mainContentTable.querySelectorAll('td');

    for (let i = 0; i < mainContentTable.length; i++) {
        let contentWithin = mainContentTable[i].querySelectorAll('font');
        for (let j = 0; j < contentWithin.length; j++) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = contentWithin[j].innerHTML;
            content.appendChild(tempDiv);
        }
    }
    return content;
};

function addStickyToolBar(tableData) {
    let anchorTagsMenu = tableData[0].querySelectorAll('area');
    let anchorTagsMenuList = ['Home', 'Essays', 'H&P', 'Books', 'YC', 
                            'Arc', 'Bel', 'Lisp', 'Spam', 'Responses', 'FAQs', 
                            'RAQs', 'Quotes', 'RSS', 'Bio', 'Twitter', 'Mastadon', 'Index', 'Email'];

    let navigationBar = document.createElement('div');
    navigationBar.setAttribute("id", "navbar");

    let i = 0;
    if (url === "https://paulgraham.com/index.html" || url === "https://paulgraham.com") {
        i = 1;
    }
    for (let j = 0; j < anchorTagsMenu.length; j++) {
        let currAnchorTag = document.createElement('a');
        currAnchorTag.href = anchorTagsMenu[j].href;
        currAnchorTag.innerHTML = anchorTagsMenuList[i];
        currAnchorTag.classList.add("font-family");
        navigationBar.appendChild(currAnchorTag);
        i++;
    }
    return navigationBar;
}

(function beautifyArticle() {
    let tableData = document.querySelectorAll('td');
    let articleMainContent = tableData[2];

    let body = document.querySelectorAll('body')[0];
    let articleContent = document.createElement('div');
    articleContent.setAttribute("id", "main-content");
    let articleTableData = articleMainContent.querySelectorAll('td')[0];
    articleContent.classList.add("center");
    articleContent.classList.add("font-family");
    articleContent.classList.add("font-size");

    let articleHeading = document.createElement('h1')
    articleHeading.innerHTML = articleTableData.querySelectorAll('img')[0].alt;
    articleHeading.classList.add("font-family");
    articleHeading.classList.add("font-size");
    articleContent.appendChild(articleHeading);

    let articleText = fetchContent(articleMainContent);
    let toolBar = addStickyToolBar(tableData);

    articleContent.appendChild(articleText);
    body.innerHTML = '';
    body.appendChild(toolBar);
    body.appendChild(articleContent);

})();