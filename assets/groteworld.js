function toggleMute() {
  const video = document.getElementById("video-frame");
  const mute = document.getElementById("mute-btn");
  video.muted = !video.muted;
  mute.innerHTML = video.muted ? '<i class="fa fa-volume-mute"></i>' : '<i class="fa fa-volume-up"></i>';
}
