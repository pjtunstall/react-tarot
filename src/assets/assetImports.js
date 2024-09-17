const sigilsContext = require.context("./sigils", false, /\.jpg$/);
const soundsContext = require.context("./sfx", false, /\.mp3$/);
const cardsContext = require.context("./cards", true, /\.jpg$/);

export const sigils = sigilsContext.keys().map(sigilsContext);
export const sfx = soundsContext.keys().map(soundsContext);
export const cardImageFolders = importAllFromSubfolders(cardsContext);

function importAllFromSubfolders(context) {
  let imagesByFolder = {};

  context.keys().forEach((path) => {
    const folderName = path.split("/")[1];
    const folderNumber = parseInt(folderName.split("_")[0]);
    if (!imagesByFolder[folderName]) {
      imagesByFolder[folderName] = [];
    }
    imagesByFolder[folderName].folderNumber = folderNumber;
    imagesByFolder[folderName].push(context(path));
  });

  imagesByFolder = Object.values(imagesByFolder);
  imagesByFolder.sort((a, b) => a.folderNumber - b.folderNumber);

  return imagesByFolder;
}
