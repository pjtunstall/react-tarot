# React Tarot

"If a fool would persist in his foolishness, he would become wise." -- William Blake.

- [Intention](#intention)
- [View online](#view-online)
- [Run locally](#run-locally)
- [Usage](#usage)
- [Credits](#credits)
- [Further](#further)

## Intention

To learn some React.

## View online

[React Tarot](https://react-tarot.netlify.app/)

## Run locally

Alternatively, to run locally:

- Instal Node.js and npm:

  - Visit the [Node.js](https://Nodeeijs.org/) website and download the installer for your operating system.
  - Run the installer, which includes `npm` (Node Package Manager), followed by the installation prompts.

- Open a terminal or command prompt:

  - On Windows, you can search for "Command Prompt" or "Power Shell" and the Start Menu.
  - On MacOS and Linux, open the "Terminal" application.

- Clone the repo and navigate to the project directory:

  - Use the `cd` command to navigate to the folder you want to download the project to.
  - Clone the repo: `git clone https://github.com/pjtunstall/react-tarot`
  - Navigate into the project: `cd react-tarot`

- Install dependencies:

  - `npm install`

- Run on a local development server:
  - `npm start`

## Usage

Click on a card to flip it, or flip the middle card with space. Arrow keys&mdash;or click once elsewhere&mdash;to turn the carousel. Click twice elsewhere to flip all. Other controls buttons at the bottom-right corner of the screen.

## Credits

Sound effects from [Pixabay](https://pixabay.com/). AI art by Dall-E.

## Further

### Synchronizing flip

Further developments could include synchronizing the flip animation better. At the moment, the cards are just rotated to 90 degrees with a CSS animation. When that finishes, they jump back to their default flat alignment. The image is changed after a timeout. Ideally, the end of this animation would trigger the image to change, which would start a second animation: from 90 degrees back to zero. (This rather than 180 degrees because we don't want the final stage of the animation to be the mirror image of the unanimated image that it will then jump to.) All this has to play nicely with React's automatic renders, not only when flipping an individual card, but also when flipping all of them at once, as happens on double click or shuffle.

### Responsivity

As yet the CSS contains just a nod towards responsive design. This could be more systematic. The site could be tested on different browsers, screens, window sizes, and devices, in particular mobile devices. Swipe handling would need to be added to make the site accessible to touchscreen devices.
