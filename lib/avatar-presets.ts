export interface AvatarPreset {
  id: string;
  label: string;
  path: string;
  prompt: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "moon-guardian",
    label: "Moon Guardian",
    path: "/avatars/presets/moon-guardian.svg",
    prompt:
      "Create a square avatar illustration of a calm moon guardian, front-facing bust portrait, silver moon halo, deep navy and teal palette, soft celestial glow, clean vector-like shapes, dreamy but friendly expression, plain background, no text, high contrast for small profile icon.",
  },
  {
    id: "forest-whisper",
    label: "Forest Whisper",
    path: "/avatars/presets/forest-whisper.svg",
    prompt:
      "Create a square avatar illustration of a mystical forest guide, front-facing bust portrait, moss green and warm gold palette, leaf crown, soft fog accents, storybook fantasy style, plain background, no text, readable at small size.",
  },
  {
    id: "sunset-oracle",
    label: "Sunset Oracle",
    path: "/avatars/presets/sunset-oracle.svg",
    prompt:
      "Create a square avatar illustration of a sunset oracle, front-facing bust portrait, amber, coral, and plum palette, glowing eyes, elegant robe collar, dreamy editorial illustration style, plain background, no text, crisp silhouette.",
  },
  {
    id: "tidal-dreamer",
    label: "Tidal Dreamer",
    path: "/avatars/presets/tidal-dreamer.svg",
    prompt:
      "Create a square avatar illustration of an ocean dream traveler, front-facing bust portrait, aqua and indigo palette, wave motifs, subtle shell ornament, tranquil expression, modern flat illustration, plain background, no text.",
  },
  {
    id: "rose-comet",
    label: "Rose Comet",
    path: "/avatars/presets/rose-comet.svg",
    prompt:
      "Create a square avatar illustration of a cosmic wanderer, front-facing bust portrait, rose, burgundy, and midnight blue palette, comet-shaped hair ornament, soft star particles, stylish fantasy portrait, plain background, no text.",
  },
  {
    id: "dawn-keeper",
    label: "Dawn Keeper",
    path: "/avatars/presets/dawn-keeper.svg",
    prompt:
      "Create a square avatar illustration of a dawn keeper, front-facing bust portrait, pale gold, sky blue, and cream palette, radiant sunrise motif behind head, gentle smile, clean semi-flat illustration, plain background, no text.",
  },
];

export const DEFAULT_AVATAR_PATH = AVATAR_PRESETS[0].path;
