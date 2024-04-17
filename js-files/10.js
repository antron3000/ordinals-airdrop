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
      "4b5adfba6c81c60bfda89ad749ea9b78132eedcaac0e1d43ab4db9ced45697e6i0",
      imageContainer
    );
  
    // If the second image fails to load, then load the first one
    if (!loaded) {
      await loadImage(
        "462ffe3f5b1c18940921888d819d09175ee9d55fe473f2d291e798f5d011ca6ai0",
        imageContainer
      );
    }
  });