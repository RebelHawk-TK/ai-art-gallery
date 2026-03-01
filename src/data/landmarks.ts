import type { LandmarkInfo } from "@/types/artwork";

export const landmarks: LandmarkInfo[] = [
  // Phase 1 — 25 landmarks
  { slug: "angkor_wat", name: "Angkor Wat", country: "Cambodia", region: "Asia", lat: 13.4125, lng: 103.867, phase: 1 },
  { slug: "big_ben", name: "Big Ben", country: "United Kingdom", region: "Europe", lat: 51.5007, lng: -0.1246, phase: 1 },
  { slug: "chichen_itza", name: "Chichen Itza", country: "Mexico", region: "North America", lat: 20.6843, lng: -88.5678, phase: 1 },
  { slug: "christ_redeemer", name: "Christ the Redeemer", country: "Brazil", region: "South America", lat: -22.9519, lng: -43.2105, phase: 1 },
  { slug: "colosseum", name: "Colosseum", country: "Italy", region: "Europe", lat: 41.8902, lng: 12.4922, phase: 1 },
  { slug: "eiffel_tower", name: "Eiffel Tower", country: "France", region: "Europe", lat: 48.8584, lng: 2.2945, phase: 1 },
  { slug: "golden_gate", name: "Golden Gate Bridge", country: "USA", region: "North America", lat: 37.8199, lng: -122.4783, phase: 1 },
  { slug: "great_wall", name: "Great Wall of China", country: "China", region: "Asia", lat: 40.4319, lng: 116.5704, phase: 1 },
  { slug: "hagia_sophia", name: "Hagia Sophia", country: "Turkey", region: "Europe", lat: 41.0086, lng: 28.9802, phase: 1 },
  { slug: "machu_picchu", name: "Machu Picchu", country: "Peru", region: "South America", lat: -13.1631, lng: -72.545, phase: 1 },
  { slug: "moai", name: "Moai Statues", country: "Chile", region: "South America", lat: -27.1127, lng: -109.3497, phase: 1 },
  { slug: "mount_fuji", name: "Mount Fuji", country: "Japan", region: "Asia", lat: 35.3606, lng: 138.7274, phase: 1 },
  { slug: "neuschwanstein", name: "Neuschwanstein Castle", country: "Germany", region: "Europe", lat: 47.5576, lng: 10.7498, phase: 1 },
  { slug: "notre_dame", name: "Notre-Dame", country: "France", region: "Europe", lat: 48.853, lng: 2.3499, phase: 1 },
  { slug: "parthenon", name: "Parthenon", country: "Greece", region: "Europe", lat: 37.9715, lng: 23.7267, phase: 1 },
  { slug: "petra", name: "Petra", country: "Jordan", region: "Middle East", lat: 30.3285, lng: 35.4444, phase: 1 },
  { slug: "pyramids_giza", name: "Pyramids of Giza", country: "Egypt", region: "Africa", lat: 29.9792, lng: 31.1342, phase: 1 },
  { slug: "sagrada_familia", name: "Sagrada Familia", country: "Spain", region: "Europe", lat: 41.4036, lng: 2.1744, phase: 1 },
  { slug: "santorini", name: "Santorini", country: "Greece", region: "Europe", lat: 36.3932, lng: 25.4615, phase: 1 },
  { slug: "st_basils", name: "St. Basil's Cathedral", country: "Russia", region: "Europe", lat: 55.7525, lng: 37.6231, phase: 1 },
  { slug: "statue_of_liberty", name: "Statue of Liberty", country: "USA", region: "North America", lat: 40.6892, lng: -74.0445, phase: 1 },
  { slug: "stonehenge", name: "Stonehenge", country: "United Kingdom", region: "Europe", lat: 51.1789, lng: -1.8262, phase: 1 },
  { slug: "sydney_opera", name: "Sydney Opera House", country: "Australia", region: "Oceania", lat: -33.8568, lng: 151.2153, phase: 1 },
  { slug: "taj_mahal", name: "Taj Mahal", country: "India", region: "Asia", lat: 27.1751, lng: 78.0421, phase: 1 },
  { slug: "tower_of_pisa", name: "Tower of Pisa", country: "Italy", region: "Europe", lat: 43.723, lng: 10.3966, phase: 1 },

  // Phase 2 — 25 landmarks
  { slug: "amsterdam_canals", name: "Amsterdam Canals", country: "Netherlands", region: "Europe", lat: 52.3676, lng: 4.9041, phase: 2 },
  { slug: "bagan_temples", name: "Bagan Temples", country: "Myanmar", region: "Asia", lat: 21.1717, lng: 94.8585, phase: 2 },
  { slug: "bruges_medieval", name: "Bruges Medieval Town", country: "Belgium", region: "Europe", lat: 51.2093, lng: 3.2247, phase: 2 },
  { slug: "charles_bridge", name: "Charles Bridge", country: "Czech Republic", region: "Europe", lat: 50.0865, lng: 14.4114, phase: 2 },
  { slug: "chefchaouen", name: "Chefchaouen", country: "Morocco", region: "Africa", lat: 35.1688, lng: -5.2636, phase: 2 },
  { slug: "edinburgh_old_town", name: "Edinburgh Old Town", country: "United Kingdom", region: "Europe", lat: 55.9533, lng: -3.1883, phase: 2 },
  { slug: "fushimi_inari", name: "Fushimi Inari Shrine", country: "Japan", region: "Asia", lat: 34.9671, lng: 135.7727, phase: 2 },
  { slug: "giants_causeway", name: "Giant's Causeway", country: "United Kingdom", region: "Europe", lat: 55.2408, lng: -6.5116, phase: 2 },
  { slug: "guanajuato", name: "Guanajuato", country: "Mexico", region: "North America", lat: 21.019, lng: -101.2574, phase: 2 },
  { slug: "hallgrimskirkja", name: "Hallgrimskirkja", country: "Iceland", region: "Europe", lat: 64.1417, lng: -21.9266, phase: 2 },
  { slug: "hapenny_bridge", name: "Ha'penny Bridge", country: "Ireland", region: "Europe", lat: 53.3462, lng: -6.2634, phase: 2 },
  { slug: "havana_vieja", name: "Havana Vieja", country: "Cuba", region: "North America", lat: 23.1355, lng: -82.3596, phase: 2 },
  { slug: "hawa_mahal", name: "Hawa Mahal", country: "India", region: "Asia", lat: 26.9239, lng: 75.8267, phase: 2 },
  { slug: "hoi_an", name: "Hoi An Ancient Town", country: "Vietnam", region: "Asia", lat: 15.8801, lng: 108.338, phase: 2 },
  { slug: "milford_sound", name: "Milford Sound", country: "New Zealand", region: "Oceania", lat: -44.6414, lng: 167.8974, phase: 2 },
  { slug: "mont_saint_michel", name: "Mont Saint-Michel", country: "France", region: "Europe", lat: 48.636, lng: -1.5115, phase: 2 },
  { slug: "moraine_lake", name: "Moraine Lake", country: "Canada", region: "North America", lat: 51.3217, lng: -116.1853, phase: 2 },
  { slug: "nyhavn", name: "Nyhavn", country: "Denmark", region: "Europe", lat: 55.6797, lng: 12.5907, phase: 2 },
  { slug: "plitvice_lakes", name: "Plitvice Lakes", country: "Croatia", region: "Europe", lat: 44.8654, lng: 15.582, phase: 2 },
  { slug: "ponte_vecchio", name: "Ponte Vecchio", country: "Italy", region: "Europe", lat: 43.768, lng: 11.2531, phase: 2 },
  { slug: "rialto_bridge", name: "Rialto Bridge", country: "Italy", region: "Europe", lat: 45.438, lng: 12.336, phase: 2 },
  { slug: "rijksmuseum", name: "Rijksmuseum", country: "Netherlands", region: "Europe", lat: 52.36, lng: 4.8852, phase: 2 },
  { slug: "temple_bar", name: "Temple Bar", country: "Ireland", region: "Europe", lat: 53.3457, lng: -6.2641, phase: 2 },
  { slug: "twelve_apostles", name: "Twelve Apostles", country: "Australia", region: "Oceania", lat: -38.6657, lng: 143.1046, phase: 2 },
  { slug: "zanzibar_stone_town", name: "Zanzibar Stone Town", country: "Tanzania", region: "Africa", lat: -6.1622, lng: 39.1921, phase: 2 },
];

export const landmarksBySlug: Record<string, LandmarkInfo> = Object.fromEntries(
  landmarks.map((l) => [l.slug, l])
);

export const landmarksByRegion: Record<string, LandmarkInfo[]> = landmarks.reduce(
  (acc, l) => {
    (acc[l.region] ??= []).push(l);
    return acc;
  },
  {} as Record<string, LandmarkInfo[]>
);
