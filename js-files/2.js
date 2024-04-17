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
      "37309e21ab7403350c08556efed8425511b48ddb2445a9c07c4d0dee7f536eddi0",
      imageContainer
    );
  
    // If the second image fails to load, then load the first one
    if (!loaded) {
      await loadImage(
        "5029bec897a35e7b3f0cff09924e7b7dc6182142683f0b6e130e0eb2713ca103i0",
        imageContainer
      );
    }
  });