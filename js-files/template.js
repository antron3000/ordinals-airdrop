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
        return true; // Indicate successful image loading
      } catch (error) {
        console.error("Error loading layer:", error);
        return false; // Indicate failed image loading
      }
    }
  
    const loaded = await loadImage(
      "b0836c2603c5fe51de8fb5674e4bc14a541a052c57dd519bf697d6f41c796aa5i0",
      imageContainer
    );
  
    // If the second image fails to load, then load the first one
    if (!loaded) {
      await loadImage(
        "2f61188f4a8fca8a1213f9fa1ae756fbd8b4682f626a92964099605aea9e6a61i0",
        imageContainer
      );
    }
  });