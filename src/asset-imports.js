const sigilsContext = require.context("./sigils", false, /\.jpg$/);
const soundsContext = require.context("./sfx", false, /\.mp3$/);
const cardsContext = require.context("./images", false, /\.jpg$/);

export const sigils = sigilsContext.keys().map(sigilsContext);
export const sfx = soundsContext.keys().map(soundsContext);
export const importedCards = cardsContext.keys().map(cardsContext);
