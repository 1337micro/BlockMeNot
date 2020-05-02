console.log("popup loaded")
document.getElementById("submit_button").onclick = addComment
function addComment(element){
  var sComment = document.getElementById("comment_box").value;
  uploadComment(sComment) 
};
function uploadComment(comment)
{
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3001/addComment", true);
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let resp = JSON.parse("{}");
      
    }
  }
  xhr.send(JSON.stringify({comment: comment}));
}
