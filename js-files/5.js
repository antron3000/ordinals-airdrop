document.addEventListener("DOMContentLoaded", async () => {
  const imageContainer = document.createElement("div");
  imageContainer.className = "image-container";
  document.body.appendChild(imageContainer);

async function loadImage(layerId, container) {
try {const response = await fetch(`/content/${layerId}`);if (!response.ok) {throw new Error("Failed to fetch layer");}const blob = await response.blob();const imgUrl = URL.createObjectURL(blob);const img = document.createElement("img");img.src = imgUrl;img.style.maxWidth = "100%";img.style.maxHeight = "100%";img.style.objectFit = "contain";container.appendChild(img);return true;} catch (error) {console.error("Error loading layer:", error);return false;
}}
const loaded = await loadImage(
  "db6fa11e985e684a1553956aaccf53ba05d390c1ffc3364e511debbfffdeb390i0",
  imageContainer
);
if (!loaded) {
  await loadImage(
    "9d71fc47daede70dde1dd4af7cdfffac18627f797d7542880ec6db2107ad62b6i0",
    imageContainer
  );
}});