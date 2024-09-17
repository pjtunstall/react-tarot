export function preloadImages(
  cardImageFolders,
  sigil_1,
  sigil_2,
  setLoadingProgress,
  setAreImagesLoaded
) {
  const imagesToLoad = [...cardImageFolders.flat(), sigil_1, sigil_2];
  const totalImages = imagesToLoad.length;

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ status: "fulfilled", value: src });
      img.onerror = () =>
        resolve({ status: "rejected", reason: `Failed to load ${src}` });
      img.src = src;
    });
  };

  Promise.allSettled(imagesToLoad.map(loadImage))
    .then((results) => {
      const loadedCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      setLoadingProgress(Math.round((loadedCount / totalImages) * 100));

      const failedImages = results.filter(
        (result) => result.status === "rejected"
      );
      if (failedImages.length > 0) {
        console.warn(
          `Failed to load ${failedImages.length} images:`,
          failedImages.map((result) => result.reason)
        );
      }

      setAreImagesLoaded(true);
    })
    .catch((error) => {
      console.error("Unexpected error during image loading:", error);
      setAreImagesLoaded(true);
    });
}
