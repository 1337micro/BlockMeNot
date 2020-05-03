console.log("popup loaded")
document.getElementById("submit_button").onclick = addComment


getAllCommentsForVideo(comments => console.log(comments))
function addComment(){
  var sComment = document.getElementById("comment_input_box").value;
  getVideoId( videoId=>{
    uploadComment(videoId, sComment, ()=>{
      getAllCommentsForVideo(comments => {
        if(comments)
        {
          document.getElementById("comments_area").innerHTML = comments.reduce( (acc, comment) =>{
            return acc + `<div>${comment}</div>`
          }, "")
        }
      })
    })
  })
};
function getAllCommentsForVideo(cb)
{
  getVideoId( videoId=>{
    getAllCommentsForVideoId(videoId, response=>{
      const comments = response.comments
      cb(comments)
    })
  })
}
function getAllCommentsForVideoId(videoId, cb)
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
function uploadComment(videoId, comment, cb)
{
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3001/addComment/"+videoId, true);
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      //todo show success message let resp = JSON.parse("{}");
      if(cb)
      {
        cb()
      }
    }
  }
  xhr.send(JSON.stringify({comment: comment}));
}

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
