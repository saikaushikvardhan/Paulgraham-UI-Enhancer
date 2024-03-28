// To Do
// 1. Maintain a map to identify the anchor tags which have already been processed, so that you won't process footnotes again
// 2. Fetch the content and create a tool tip
// 3. Instead of making the current anchor clickable, create a new anchor called ^.
// 4. Make the scroll after the click smooth.
// 5. Create a popup html and js and interact with content script to modify the width, font type and font size maybe.


const url = window.location.href;
const allAnchorTags = document.querySelectorAll('a');

for (var i = 0; i < allAnchorTags.length; i++) {
    const currTag = allAnchorTags[i];
    const currTagUrl = allAnchorTags[i].href;


    if (currTagUrl && currTagUrl.includes(url) && currTagUrl.includes("#")) {
        var footNoteId = currTagUrl.substring(currTagUrl.indexOf("#")).substring(1); // removing the '#'
        var currTagId = currTag.name;

        if (!currTagId) {
            currTagId = footNoteId + 'f';
        } else {
            continue;
        }
        
        currTag.setAttribute("name", currTagId);
        currTagId = "#" + currTagId;
        
        // setting the current element reference to the footnote.
        const footNoteElement = document.getElementsByName(footNoteId)[0];
        footNoteElement.href = url+currTagId;
        const goBackUpAnchor = document.createElement('a');
        goBackUpAnchor.href = url+currTagId;
        goBackUpAnchor.innerHTML = "^";
        footNoteElement.previousSibling.before(goBackUpAnchor);
        

        const content = footNoteElement.nextSibling;
    }
}

console.log(allAnchorTags.length);

