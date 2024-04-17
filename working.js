document.addEventListener("DOMContentLoaded", async () => {
  const imageContainer = document.createElement("div");
  imageContainer.className = "image-container";
  document.body.appendChild(imageContainer);

  async function loadImage(layerId, container) {
    try {
      const response = await fetch(`/content/${layerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch layer");
      }
      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      const img = document.createElement("img");
      img.src = imgUrl;
      img.style.maxWidth = "100%"; // Set max width to 100%
      img.style.maxHeight = "100%"; // Set max height to 100%
      img.style.objectFit = "contain"; // Maintain aspect ratio and fit inside container
      container.appendChild(img);
    } catch (error) {
      console.error("Error loading layer:", error);
    }
  }

  await loadImage(
    "b9f9017f8c803ed1ae68ae5d48a47658a551efdc9901bca1522cb2b7875502f5i0",
    imageContainer
  );
  await loadImage(
    "4360df1f28db526b9f5ac6cdf466d4c5888d73f7321dbeb25dcee78f6aaa3268ai0",
    imageContainer
  );
});
