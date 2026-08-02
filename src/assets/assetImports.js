const sigilModules = import.meta.glob("./sigils/*.jpg", {
  eager: true,
  import: "default",
});
const sfxModules = import.meta.glob("./sfx/*.mp3", {
  eager: true,
  import: "default",
});
const cardModules = import.meta.glob("./cards/**/*.jpg", {
  eager: true,
  import: "default",
});

export const sigils = Object.keys(sigilModules)
  .sort()
  .map((key) => sigilModules[key]);

export const sfx = Object.keys(sfxModules)
  .sort()
  .map((key) => sfxModules[key]);

export const cardImageFolders = importAllFromSubfolders(cardModules);

function importAllFromSubfolders(modules) {
  let imagesByFolder = {};

  Object.keys(modules)
    .sort()
    .forEach((path) => {
      const folderName = path.split("/")[2];
      const folderNumber = parseInt(folderName.split("_")[0], 10);
      if (!imagesByFolder[folderName]) {
        imagesByFolder[folderName] = [];
      }
      imagesByFolder[folderName].folderNumber = folderNumber;
      imagesByFolder[folderName].push(modules[path]);
    });

  imagesByFolder = Object.values(imagesByFolder);
  imagesByFolder.sort((a, b) => a.folderNumber - b.folderNumber);

  return imagesByFolder;
}
