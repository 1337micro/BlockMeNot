console.log("Fired embedCommentsIntoYoutube.js")
insertCSS(`
  .commenterName {
    font-weight: 500;
    font-size: 18px;
    font-family: Roboto, Arial, sans-serif;
  }
  .commentText {
    color: #030303;
    font-size: 14px;
    font-family: Roboto, Arial, sans-serif;
  }
  .commentBox{
    position: relative;
    width: 100%;
    min-width: 250px;
    min-height: 65px;
  }
  .commentSectionHeader{
    margin-bottom: 20px;
  }
`)
let intervalToFindComments;
let videoId;
chrome.runtime.sendMessage({directive: "GET_VIDEO_ID"}, function(response) {
    console.log("Recieved video id: " , response.videoId);
    if(response.videoId)
    {
      videoId = response.videoId
      intervalToFindComments = setInterval(attemptToFindCommentSection, 5000);
    }
});
function onCommentSectionFound(comment_section_container)
{
  if(videoId)
  {
    chrome.runtime.sendMessage({directive: "REQUEST_VIDEO_COMMENTS"}, function(response) {
      console.log("Recieved comments ", response);

      comment_section_container.innerHTML = "<span></span>"//reset contents

      if(response && response.comments && response.comments.forEach)
      {
        response.comments.forEach( (comment)=> {
          if(typeof comment === "string")
          {
            comment_section_container.insertAdjacentHTML('afterbegin', `<div class="commenterName">Guest</div>
            <div class="commentText">${comment}</div>`)
          }
          else if (typeof comment === "object")
          {
            let channelName = comment.channel
            let commentString = comment.comment
            let commentDate = comment.date
            if(commentDate)
            {
              commentDate = new Date(commentDate)
            }
            comment_section_container.insertAdjacentHTML('afterbegin', `<div><span class="commenterName">${channelName}</span>
              <span class="commentText">${commentDate != undefined ? commentDate.toString() : ""}</span></div>
              <div class="commentText">${commentString}</div>`)
          }
          
        })
        comment_section_container.insertAdjacentHTML('afterbegin', `
        <div class="commentSectionHeader">
          <div class="commenterName">Comment Section Enabled by BlockMeNot</div>
          <textarea id="comment_input_box" type="text" class="commentBox" placeholder="Add a public comment..."></textarea>
          <div>
            <button type="button" id="submit_button">Submit</button>
          </div>
        </div>
        `)
  
      }
      addSubmitButtonListener()
    })
  }  
}
function getChannelName()
{
  const videoOwnerElement = document.querySelector("ytd-video-owner-renderer")
  const channelNameContainerElement = videoOwnerElement.querySelector("yt-formatted-string")
  const channelNameLinkElement = channelNameContainerElement.querySelector("a")
  return channelNameLinkElement.innerHTML    
}
function addSubmitButtonListener()
{
  document.getElementById("submit_button").onclick  = addComment
}
function clearCommentBox()
{
  document.getElementById("comment_input_box").innerHTML = ""
}
function addComment(){
  let channelName = "Guest";
  try
  {
    channelName = getChannelName()
  } catch(failedToGetChannelNameError)
  {
    console.error("Failed to get channel name, defaulting to 'Guest'", failedToGetChannelNameError)
  }

  var sComment = document.getElementById("comment_input_box").value;
  chrome.runtime.sendMessage({directive: "REQUEST_UPLOAD_COMMENT", channel:channelName, comment:sComment}, function(response) {
    console.log("Sent comment ", sComment, response)
    clearCommentBox()
    attemptToFindCommentSection()
  })
};
function attemptToFindCommentSection()
{
    const section_container = document.getElementById("sections");
    if(section_container != undefined && section_container.children != undefined)
    {
        for(let i = 0; i< section_container.children.length; i++)
        {
          let childOfSectionContainer = section_container.children[i];
          if(childOfSectionContainer.id === "contents")
          {
            let comment_section_container = childOfSectionContainer
            if(comment_section_container && comment_section_container.children != undefined)
            {
              if(comment_section_container.children.length === 0)
              {
                //we found an empty comment section, comments not disabled
                clearInterval(intervalToFindComments)
              }
              else
              {
                let array_comment_section_container = Array.prototype.slice.call(comment_section_container.children)
                if(array_comment_section_container.some(commentElement=>commentElement.tagName === "YTD-COMMENT-THREAD-RENDERER"))
                {
                   //we found a comment section with comments in it, comments not disabled
                  clearInterval(intervalToFindComments)
                }
                else
                {
                  //At this point we assume the comment section is disabled
                  clearInterval(intervalToFindComments)
                  onCommentSectionFound(comment_section_container)
                }
              }
            }
          }
        }
    }
}

function insertCSS(css)
{
  if(document.head)
  {
    const style = document.createElement('style');
    document.head.appendChild(style)

    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
  }
}
function insertScript(src)
{
  if(document.head)
  {
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute("src", src)
    document.head.appendChild(scriptElement)    
  }
}


