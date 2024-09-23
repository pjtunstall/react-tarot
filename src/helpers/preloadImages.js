export function preloadImages(
  cardImageFolders,
  sigil_1,
  sigil_2,
  setLoadingProgress,
  setAreImagesLoaded
) {
  const imagesToLoad = [...cardImageFolders.flat(), sigil_1, sigil_2];
  const totalImages = imagesToLoad.length;
  let loadedCount = 0;

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
        resolve({ status: "fulfilled", value: src });
      };
      img.onerror = () =>
        resolve({ status: "rejected", reason: `Failed to load ${src}` });
      img.src = src;
    });
  };

  Promise.allSettled(imagesToLoad.map(loadImage))
    .then((results) => {
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
      console.error("Failed to load any images:", error);
      setAreImagesLoaded(true);
    });
}
