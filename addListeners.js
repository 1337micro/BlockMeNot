
console.log("addListenersjs loaded");
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains  'youtube' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'youtube' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ] //fire chrome.pageAction.onClicked
      }
    ]);
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.directive === "GET_VIDEO_ID")
    {
      getVideoId(videoId=>{
        sendResponse({videoId: videoId});
      })
    }
    else if(request.directive === "REQUEST_VIDEO_COMMENTS")
    {
      getVideoId(videoId=>{
        getAllCommentsForVideo(videoId, (response)=>{
          sendResponse(response)
        })
      })
    }
    else if(request.directive === "REQUEST_UPLOAD_COMMENT")
    {
      getVideoId(videoId=>{
        uploadComment(videoId, request, (response)=>{
          sendResponse(response)
        })
      })
    }
    return true;
     
  });

  function getVideoId(cb)
  {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs){
      if(!tabs)
      {
        throw new Error("Catastrophic")
      }
      const tab = tabs[0]
      const url = new URL(tab.url); 
      const params = new URLSearchParams(url.search);
      const videoId = params.get('v');
      cb(videoId);
  })
}
function getAllCommentsForVideo(videoId, cb)
{
  if(videoId != undefined && cb != undefined)
  {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3001/getAllComments/"+videoId, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if(cb)
        {
          let response = xhr.response;
          if(xhr.response)
          {
            response = JSON.parse(xhr.response)
          }
          cb(response)
        }
      }
    }
    xhr.send();
  }    
}

function uploadComment(videoId, comment, cb)
{
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3001/addComment/"+videoId, true);
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.onreadystatechange = function() {
    if(cb)
    {
      cb(xhr.readyState)
    }    
  }
  xhr.send(JSON.stringify({comment: comment}));
}
