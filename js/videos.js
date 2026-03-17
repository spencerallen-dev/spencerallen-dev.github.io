const PLAYLIST_ID = 'PLTAcCeE2DCByBIN0RIev6mXmwtUXQ54UF';
const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=' + PLAYLIST_ID;
const MAX_POLL_ATTEMPTS = 20;
let ytPlayer = null;
let pollAttempts = 0;

// Load YouTube IFrame Player API
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    playerVars: {
      listType: 'playlist',
      list: PLAYLIST_ID,
      autoplay: 0
    },
    events: {
      onReady: onPlayerReady,
      onError: onPlayerError
    }
  });
}

function onPlayerReady(event) {
  pollForPlaylist(event.target);
}

function pollForPlaylist(player) {
  var ids = player.getPlaylist();
  if (ids && ids.length > 0) {
    displayVideoLinks(ids);
  } else if (pollAttempts < MAX_POLL_ATTEMPTS) {
    pollAttempts++;
    setTimeout(function() { pollForPlaylist(player); }, 500);
  } else {
    showFallback();
  }
}

function onPlayerError() {
  showFallback();
}

function showFallback() {
  var container = document.getElementById('video-links');
  container.innerHTML = '';
  var msg = document.createElement('p');
  msg.textContent = 'Could not load playlist automatically. ';
  var link = document.createElement('a');
  link.href = PLAYLIST_URL;
  link.textContent = 'View playlist on YouTube';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'video-link';
  msg.appendChild(link);
  container.appendChild(msg);
}

function displayVideoLinks(videoIds) {
  var container = document.getElementById('video-links');
  container.innerHTML = '';

  if (!videoIds || videoIds.length === 0) {
    showFallback();
    return;
  }

  var count = document.createElement('p');
  count.className = 'video-count';
  count.textContent = videoIds.length + ' video' + (videoIds.length !== 1 ? 's' : '') + ' in this playlist:';
  container.appendChild(count);

  var linksContainer = document.createElement('div');
  linksContainer.className = 'video-links-list';

  videoIds.forEach(function(id, index) {
    if (index > 0) {
      linksContainer.appendChild(document.createTextNode(' '));
    }
    var url = 'https://www.youtube.com/watch?v=' + id;
    var a = document.createElement('a');
    a.href = url;
    a.textContent = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'video-link';
    linksContainer.appendChild(a);
  });

  container.appendChild(linksContainer);
}
