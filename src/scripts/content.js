window.addEventListener("load",(()=>{
    for (let i=1;i<100;i++){
        console.log("youtube extensions loaded");
    }
    let head = document.getElementsByTagName("head")[0]
    let video_title = head.getElementsByTagName("title")[0]
    const currentUrl = window.location.href;
    console.log(currentUrl);  // Logs the URL of the page where the content script runs
    // let button_exists = 0 // can be 0 or 1

    const config = {attributes:true,childList:true,subtree:true}

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            console.log("A child node has been added or removed.");
            console.log("childlist mutation occured")
            video_title_element = head.getElementsByTagName("title")[0]
            console.log("new title is :",video_title_element.textContent)

            let video_title = video_title_element.textContent

            let playAll_button = create_playAll_button()

            

            let newUrl = window.location.href;
            console.log(newUrl);  // Logs the URL of the page where the content script runs


            if (newUrl.includes("watch")){
              console.log("Youtube video page")
            }

            


            

          } else if (mutation.type === "attributes") {
            console.log(`The ${mutation.attributeName} attribute was modified.`);
            console.log(`New Title is ${video_title.textContent}`)
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(video_title, config);



}))

function create_playAll_button(){
  

    return button
}


function debugger_pause_test(){
  
}