document.addEventListener("DOMContentLoaded", async () => {
  const imageContainer = document.createElement("div");
  imageContainer.className = "image-container";
  document.body.appendChild(imageContainer);

async function loadImage(layerId, container) {
try {const response = await fetch(`/content/${layerId}`);if (!response.ok) {throw new Error("Failed to fetch layer");}const blob = await response.blob();const imgUrl = URL.createObjectURL(blob);const img = document.createElement("img");img.src = imgUrl;img.style.maxWidth = "100%";img.style.maxHeight = "100%";img.style.objectFit = "contain";container.appendChild(img);return true;} catch (error) {console.error("Error loading layer:", error);return false;
}}
const loaded = await loadImage(
  "40bc9e0ffde310f7e5e84edc8e64e2b66a554f3903e8e0c140270acb48aa0f8bi0",
  imageContainer
);
if (!loaded) {
  await loadImage(
    "9d71fc47daede70dde1dd4af7cdfffac18627f797d7542880ec6db2107ad62b6i0",
    imageContainer
  );
}});