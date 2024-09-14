import fool from "./images/0_fool.jpg";
import magician from "./images/1_magician.jpg";
import highPriestess from "./images/2_high-priestess.jpg";
import empress from "./images/3_empress.jpg";
import hierophant from "./images/5_hierophant.jpg";
import lovers from "./images/6_lovers.jpg";
import hermit from "./images/9_hermit.jpg";
import emperor from "./images/4_emperor.jpg";
import justice from "./images/8_justice.jpg";
import chariot from "./images/7_chariot.jpg";
import fortune from "./images/10_fortune.jpg";
import strength from "./images/11_strength.jpg";
import hangedMan from "./images/12_hanged-man.jpg";
import death from "./images/13_death.jpg";
import temperance from "./images/14_temperance.jpg";
import devil from "./images/15_devil.jpg";
import tower from "./images/16_tower.jpg";
import star from "./images/17_star.jpg";
import moon from "./images/18_moon.jpg";
import sun from "./images/19_sun.jpg";
import judgement from "./images/20_judgement.jpg";
import world from "./images/21_world.jpg";

const sigilsContext = require.context("./images/sigils", false, /\.jpg$/);
const soundsContext = require.context("./sfx", false, /\.mp3$/);

export const sigils = sigilsContext.keys().map(sigilsContext);
export const sfx = soundsContext.keys().map(soundsContext);

export const importedCards = [
  sun,
  judgement,
  world,
  fool,
  magician,
  highPriestess,
  emperor,
  empress,
  hierophant,
  lovers,
  chariot,
  justice,
  hermit,
  fortune,
  strength,
  hangedMan,
  death,
  temperance,
  devil,
  tower,
  star,
  moon,
];
