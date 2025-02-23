class button {
  constructor(url, channelId, type) {
    this.url = url;
    if (type == "playAll") {
      let playlist_link =
        "https://www.youtube.com/playlist?list=" +
        "UU" +
        channelId.substring(2, channelId.length);
      this.playlist_link = playlist_link;
    }
  }
}

window.addEventListener("load", () => {
  for (let i = 1; i < 2; i++) {
    console.log("youtube extensions loaded");
  }

  let head = document.getElementsByTagName("head")[0];
  let video_title = head.getElementsByTagName("title")[0];
  const currentUrl = window.location.href;
  console.log(currentUrl); // Logs the URL of the page where the content script runs

  const config = { attributes: true, childList: true, subtree: true };

  const callback = (mutationList, observer) => {
    // console.log(ytInitialData);
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
        video_title_element = head.getElementsByTagName("title")[0];

        let video_title = video_title_element.textContent;
        console.log("new title is :", video_title);

        let playAll_exist = 0;
        if (document.getElementById("playAll_button") != undefined) {
          playAll_exist = 1;
        }
        // const currentUrl = window.location.href;

        let newUrl = window.location.href;
        console.log(newUrl); // Logs the URL of the page where the content script runs

        if (newUrl.includes("watch")) {
          console.log("Youtube video page");
          const yt_watch_metadata =
            document.getElementsByTagName("ytd-watch-metadata")[0];
          console.log(yt_watch_metadata.querySelector("#top-row"));
          const yt_buttons_row = yt_watch_metadata.querySelector("#top-row");

          if (!playAll_exist) {
            let channel_button = document.getElementsByClassName(
              "yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading"
            )[0];
            console.log("before slicing channel id: ", channel_button.href);
            let channelId = channel_button.href.replace(
              "https://www.youtube.com/channel/",
              ""
            );
            channelId = channelId.replace("/videos", "");
            console.log("channel id: ", channelId);
            let playAll_button = create_button("playAll", newUrl, channelId);

            console.log("playlist link: ", playAll_button.playlist_link);
            let playAll_html = document.createElement("button");
            const message = {
              action: "open_tab",
              url: playAll_button.playlist_link,
            };
            console.log("Sending message:", message);
            playAll_html.addEventListener("click", (playAll_button) => {
              console.log("playAll button pressed");
              chrome.runtime.sendMessage({ message });
            });
            playAll_html.id = "playAll_button";
            yt_buttons_row.appendChild(playAll_html);
            console.log(playAll_html);
          }
        }
      } else if (mutation.type === "attributes") {
        console.log(`The ${mutation.attributeName} attribute was modified.`);
        console.log(`New Title is ${video_title.textContent}`);
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(video_title, config);
});

function create_button(button_type, url, channelId) {
  if (button_type == "playAll") {
    const playAll_button = new button(url, channelId, "playAll");
    console.log(playAll_button.playlist_link);
    return playAll_button;
  }

  return playAll_button;
}

function debugger_pause_test() {}
