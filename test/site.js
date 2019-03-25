

document.getElementById("challenge").onclick = function(e) {
  
  rch.challenge(document.getElementById("url").value, 
                document.getElementById("windowSize").value,
                document.getElementById("container"), 
                function (result) {
    document.getElementById("result").value 
      = Date() + "\n" + JSON.stringify(result);
  });
  
}

