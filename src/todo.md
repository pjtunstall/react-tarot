# Todo

## Random picture pools

Introduce logic to pick an image at random from an array of possibilities for each card. Try this Webpack technique for importing all images from a given folder into an array.

```javascript
const imagesContext = require.context("./images", false, /\.jpg$/);
const images = imagesContext.keys().map(imagesContext);
export const importedImages = images;
```

## More diverse pictures

## Preload images

. . . probably, or perhaps delay first flip of a card (post-shuffle) till its image has loaded.

## Refactor
