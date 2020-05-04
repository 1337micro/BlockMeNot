console.log("Fired embedCommentsIntoYoutube.js")
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
      console.log("Recieved comments " , response);
      if(response && response.comments && response.comments.forEach)
      {
        response.comments.forEach( (comment)=> {
          comment_section_container.insertAdjacentHTML('afterend', `<h3>${comment}</h3>`)//todo security
        })
      }
      comment_section_container.insertAdjacentHTML('afterend', `
      <h1>Comment Section Enabled by BlockMeNot</h1>    
        <label for="comment_box"> Add a comment: </label>
        <input id="comment_input_box" type="text" />
        <button type="button" id="submit_button">Submit</button>
      `)
      addSubmitButtonListener()
    })
  }  
}
function addSubmitButtonListener()
{
  document.getElementById("submit_button").onclick  = addComment
}
function addComment(){
  var sComment = document.getElementById("comment_input_box").value;
  chrome.runtime.sendMessage({directive: "REQUEST_UPLOAD_COMMENT", comment:sComment}, function(response) {
    console.log("Sent comment ", sComment, response)
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


