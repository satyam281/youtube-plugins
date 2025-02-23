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
  console.log("youtube extension loaded");

  let head = document.getElementsByTagName("head")[0];
  let video_title = head.getElementsByTagName("title")[0];
  const currentUrl = window.location.href;
  console.log("current page url :", currentUrl);

  const config = { attributes: true, childList: true, subtree: true };

  const callback = (mutationList, observer) => {
    const port = chrome.runtime.connect(); // for messaging the background service worker
    // console.log(ytInitialData);
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        console.log("youtube page changed/loaded");
        video_title_element = head.getElementsByTagName("title")[0];

        let video_title = video_title_element.textContent;
        console.log("new video/page title is :", video_title);

        let playAll_exist = 0;
        if (document.getElementById("playAll_button") != undefined) {
          playAll_exist = 1;
        }

        let newUrl = window.location.href;
        console.log("page url after change: ", newUrl);

        if (newUrl.includes("watch")) {
          //a youtube video page
          console.log("Entered a Youtube video page");
          const yt_watch_metadata =
            document.getElementsByTagName("ytd-watch-metadata")[0];

          console.log("youtube buttons area: ");
          const yt_buttons_row = yt_watch_metadata.querySelector("#top-row");
          console.log(yt_buttons_row);

          if (!playAll_exist) {
            let channel_button = document.getElementsByClassName(
              "ytp-ce-channel-title ytp-ce-link"
            )[0]
              ? document.getElementsByClassName(
                  "ytp-ce-channel-title ytp-ce-link"
                )[0]
              : document.getElementsByClassName(
                  "yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading"
                )[0];

            let channelId = channel_button.href
              .replace("/channel/", "")
              .replace("https://www.youtube.com", "")
              .replace("/videos", "");
            console.log("channel id: ", channelId);
            let playAll_button = create_button("playAll", newUrl, channelId);

            console.log(
              "playAll playlist link: ",
              playAll_button.playlist_link
            );

            let playAll_html = document.createElement("button");
            playAll_html.textContent = "Play all";
            playAll_html.style.cssText =
              "border-width:0px ; margin-right:8px; background: rgba(255,255,255,0.1) ; color: #f1f1f1;border-radius:20px; \
              padding:0 14px; font-family: Roboto, Arial, sans-serif; font-weight: 500; font-size: 14px;";
            playAll_html.addEventListener("mouseenter", () => {
              playAll_html.style.cssText =
                "border-width:0px ; margin-right:8px; background:rgb(65,65,65); color: #f1f1f1;border-radius:20px; \
              padding:0 14px; font-family: Roboto, Arial, sans-serif; font-weight: 500; font-size: 14px;";
            });
            playAll_html.addEventListener("mouseleave", () => {
              playAll_html.style.cssText =
                "border-width:0px ; margin-right:8px; background: rgba(255,255,255,0.1) ; color: #f1f1f1;border-radius:20px; \
              padding:0 14px; font-family: Roboto, Arial, sans-serif; font-weight: 500; font-size: 14px;";
            });
            const message = {
              action: "open_tab",
              url: playAll_button.playlist_link,
            };
            console.log("Sending message:", message);
            playAll_html.addEventListener("click", (playAll_button) => {
              console.log("playAll button pressed");
              port.postMessage(message);
              // chrome.runtime.sendMessage({ message });
            });
            playAll_html.id = "playAll_button";

            const menu =
              yt_buttons_row.getElementsByTagName("ytd-menu-renderer")[0];

            menu.insertBefore(playAll_html, menu.children[0]);
            // yt_buttons_row.appendChild(playAll_html);
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
