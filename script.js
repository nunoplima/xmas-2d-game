window.onload = () => {
  const audio = document.getElementsByTagName("audio")[0];
  const button = document.getElementById("img");
  button.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      button.src = "assets/on.png";
    } else {
      audio.pause();
      button.src = "assets/off.png";
    }
  });
}
