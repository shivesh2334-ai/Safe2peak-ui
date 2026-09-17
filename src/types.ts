/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PeakData {
  name: string;
  elevation: number;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Extreme';
  currentTemp: number;
  windSpeed: number;
  safetyScore: number;
  status: 'Open' | 'Caution' | 'Closed';
}

export const POPULAR_PEAKS: PeakData[] = [
  {
    name: "Mount Everest",
    elevation: 8848,
    location: "Himalayas, Nepal/China",
    difficulty: "Extreme",
    currentTemp: -25,
    windSpeed: 45,
    safetyScore: 42,
    status: "Caution"
  },
  {
    name: "K2",
    elevation: 8611,
    location: "Karakoram, Pakistan/China",
    difficulty: "Extreme",
    currentTemp: -30,
    windSpeed: 60,
    safetyScore: 28,
    status: "Closed"
  },
  {
    name: "Mont Blanc",
    elevation: 4808,
    location: "Alps, France/Italy",
    difficulty: "Hard",
    currentTemp: -10,
    windSpeed: 20,
    safetyScore: 75,
    status: "Open"
  },
  {
    name: "Mount Rainier",
    elevation: 4392,
    location: "Cascades, USA",
    difficulty: "Hard",
    currentTemp: -5,
    windSpeed: 15,
    safetyScore: 82,
    status: "Open"
  },
  {
    name: "Kilimanjaro",
    elevation: 5895,
    location: "Tanzania",
    difficulty: "Moderate",
    currentTemp: 2,
    windSpeed: 10,
    safetyScore: 90,
    status: "Open"
  }
];
