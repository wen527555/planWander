interface Place {
  name: string;
  latitude: number;
  longitude: number;
  color: string;
  number: number;
  route?: Route;
}

interface Route {
  type: string;
  coordinates: [number, number][];
  color?: string;
}

interface Day {
  places: Place[];
  route?: Route;
}

const colors = [
  '#00c8ff',
  '#8e8ee0',
  '#ed7fcc',
  '#f1a731',
  '#41e26c',
  '#2ddde3',
  '#2c4ae0',
  '#83d685',
  '#dc9a61',
  '#dc618a',
];
const getRandomLightColor = () => {
  const letters = 'BCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

export const getColorForDate = (dateIndex: number) => {
  if (dateIndex < colors.length) {
    return colors[dateIndex];
  } else {
    return getRandomLightColor();
  }
};

export const processDays = (days: Day[]): { places: Place[]; route: Route[] } => {
  const places: Place[] = [];
  const routes: Route[] = [];
  days.forEach((day, dayIndex) => {
    const color = getColorForDate(dayIndex);
    day.places?.forEach((place, index) => {
      places.push({
        ...place,
        color,
        number: index + 1,
      });

      if (place.route) {
        routes.push({
          type: place.route.type,
          coordinates: place.route.coordinates.map((coord: { lat: number; lng: number }) => [coord.lng, coord.lat]),
          color: color,
        });
      }
    });
  });
  return { places, routes };
};
