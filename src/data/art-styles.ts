import type { StyleInfo } from "@/types/artwork";

export const artStyles: StyleInfo[] = [
  {
    slug: "cafe_terrace",
    name: "Cafe Terrace at Night",
    artist: "Vincent van Gogh",
    year: "1888",
    description:
      "Warm golden lantern light spills across a cobblestone terrace, blending rich yellows with deep blues of the night sky. Van Gogh's bold brushwork brings vibrant energy to nocturnal scenes.",
  },
  {
    slug: "composition_vii",
    name: "Composition VII",
    artist: "Wassily Kandinsky",
    year: "1913",
    description:
      "A symphony of swirling forms and vivid colors that channels pure abstraction. Kandinsky's masterwork transforms subjects into dynamic compositions of shape, line, and color.",
  },
  {
    slug: "great_wave",
    name: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    year: "1831",
    description:
      "Powerful curling waves rendered in Hokusai's iconic ukiyo-e woodblock style, with dramatic blues and whites creating a sense of nature's immense power and beauty.",
  },
  {
    slug: "starry_night",
    name: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    description:
      "Swirling cosmic skies alive with luminous stars and rolling clouds. Van Gogh's most recognizable style transforms landscapes into dreamlike visions of movement and light.",
  },
  {
    slug: "the_scream",
    name: "The Scream",
    artist: "Edvard Munch",
    year: "1893",
    description:
      "Undulating waves of color radiate outward in bands of orange, red, and blue, creating an atmosphere of raw emotional intensity and existential energy.",
  },
  {
    slug: "water_lilies",
    name: "Water Lilies",
    artist: "Claude Monet",
    year: "1906",
    description:
      "Soft, impressionistic layers of color dissolve boundaries between water, light, and reflection. Monet's serene palette creates tranquil, meditative compositions.",
  },
];

export const artStylesBySlug: Record<string, StyleInfo> = Object.fromEntries(
  artStyles.map((s) => [s.slug, s])
);

export const ART_STYLE_SLUGS = artStyles.map((s) => s.slug);
