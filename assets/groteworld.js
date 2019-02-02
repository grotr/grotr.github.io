function toggleMute() {
  const video = document.getElementById("video-frame");
  const mute = document.getElementById("mute-btn");
  video.muted = !video.muted;
  mute.innerHTML = video.muted ? "&#x1f507;" : "&#x1f50a;"
}
