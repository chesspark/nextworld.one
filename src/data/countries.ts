export interface Country {
  code: string;
  name: string;
  lat: number;
  lng: number;
  landmark: string;
  landmarkImage: string;
}

export const countries: Country[] = [
  { code: "FR", name: "France", lat: 46.6, lng: 2.2, landmark: "Tour Eiffel", landmarkImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80" },
  { code: "US", name: "United States", lat: 39.8, lng: -98.6, landmark: "Statue of Liberty", landmarkImage: "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=1600&q=80" },
  { code: "GB", name: "United Kingdom", lat: 55.4, lng: -3.4, landmark: "Big Ben", landmarkImage: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1600&q=80" },
  { code: "JP", name: "Japan", lat: 36.2, lng: 138.3, landmark: "Mount Fuji", landmarkImage: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1600&q=80" },
  { code: "BR", name: "Brazil", lat: -14.2, lng: -51.9, landmark: "Christ the Redeemer", landmarkImage: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80" },
  { code: "DE", name: "Germany", lat: 51.2, lng: 10.4, landmark: "Brandenburg Gate", landmarkImage: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1600&q=80" },
  { code: "IT", name: "Italy", lat: 41.9, lng: 12.6, landmark: "Colosseum", landmarkImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&q=80" },
  { code: "CN", name: "China", lat: 35.9, lng: 104.2, landmark: "Great Wall", landmarkImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&q=80" },
  { code: "IN", name: "India", lat: 20.6, lng: 79.0, landmark: "Taj Mahal", landmarkImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80" },
  { code: "AU", name: "Australia", lat: -25.3, lng: 133.8, landmark: "Sydney Opera House", landmarkImage: "https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=1600&q=80" },
  { code: "RU", name: "Russia", lat: 61.5, lng: 105.3, landmark: "Saint Basil's Cathedral", landmarkImage: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1600&q=80" },
  { code: "CA", name: "Canada", lat: 56.1, lng: -106.3, landmark: "Niagara Falls", landmarkImage: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=1600&q=80" },
  { code: "MX", name: "Mexico", lat: 23.6, lng: -102.6, landmark: "Chichén Itzá", landmarkImage: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1600&q=80" },
  { code: "EG", name: "Egypt", lat: 26.8, lng: 30.8, landmark: "Pyramids of Giza", landmarkImage: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1600&q=80" },
  { code: "ZA", name: "South Africa", lat: -30.6, lng: 22.9, landmark: "Table Mountain", landmarkImage: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1600&q=80" },
  { code: "KR", name: "South Korea", lat: 35.9, lng: 127.8, landmark: "Gyeongbokgung Palace", landmarkImage: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1600&q=80" },
  { code: "AR", name: "Argentina", lat: -38.4, lng: -63.6, landmark: "Obelisco de Buenos Aires", landmarkImage: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1600&q=80" },
  { code: "ES", name: "Spain", lat: 40.5, lng: -3.7, landmark: "Sagrada Familia", landmarkImage: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&q=80" },
  { code: "SA", name: "Saudi Arabia", lat: 23.9, lng: 45.1, landmark: "Kaaba", landmarkImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d99f7e?w=1600&q=80" },
  { code: "TR", name: "Turkey", lat: 38.9, lng: 35.2, landmark: "Hagia Sophia", landmarkImage: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1600&q=80" },
  { code: "NG", name: "Nigeria", lat: 9.1, lng: 8.7, landmark: "Zuma Rock", landmarkImage: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1600&q=80" },
  { code: "KE", name: "Kenya", lat: -0.0, lng: 37.9, landmark: "Maasai Mara", landmarkImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80" },
  { code: "TH", name: "Thailand", lat: 15.9, lng: 100.9, landmark: "Wat Arun", landmarkImage: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1600&q=80" },
  { code: "SE", name: "Sweden", lat: 60.1, lng: 18.6, landmark: "Stockholm Old Town", landmarkImage: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1600&q=80" },
  { code: "CH", name: "Switzerland", lat: 46.8, lng: 8.2, landmark: "Matterhorn", landmarkImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1600&q=80" },
  { code: "IL", name: "Israel", lat: 31.0, lng: 34.9, landmark: "Western Wall", landmarkImage: "https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=1600&q=80" },
  { code: "AE", name: "United Arab Emirates", lat: 23.4, lng: 53.8, landmark: "Burj Khalifa", landmarkImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80" },
  { code: "SG", name: "Singapore", lat: 1.4, lng: 103.8, landmark: "Marina Bay Sands", landmarkImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&q=80" },
  { code: "MA", name: "Morocco", lat: 31.8, lng: -7.1, landmark: "Hassan II Mosque", landmarkImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600&q=80" },
  { code: "CO", name: "Colombia", lat: 4.6, lng: -74.3, landmark: "Cartagena", landmarkImage: "https://images.unsplash.com/photo-1583531172005-814813c78d69?w=1600&q=80" },
  { code: "PE", name: "Peru", lat: -9.2, lng: -75.0, landmark: "Machu Picchu", landmarkImage: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1600&q=80" },
  { code: "GR", name: "Greece", lat: 39.1, lng: 21.8, landmark: "Parthenon", landmarkImage: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=1600&q=80" },
  { code: "PT", name: "Portugal", lat: 39.4, lng: -8.2, landmark: "Tower of Belém", landmarkImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&q=80" },
  { code: "PL", name: "Poland", lat: 51.9, lng: 19.1, landmark: "Wawel Castle", landmarkImage: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=1600&q=80" },
  { code: "NO", name: "Norway", lat: 60.5, lng: 8.5, landmark: "Fjords", landmarkImage: "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=1600&q=80" },
  { code: "NZ", name: "New Zealand", lat: -40.9, lng: 174.9, landmark: "Milford Sound", landmarkImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1600&q=80" },
  { code: "CL", name: "Chile", lat: -35.7, lng: -71.5, landmark: "Torres del Paine", landmarkImage: "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=1600&q=80" },
  { code: "ID", name: "Indonesia", lat: -0.8, lng: 113.9, landmark: "Borobudur", landmarkImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&q=80" },
  { code: "PH", name: "Philippines", lat: 12.9, lng: 121.8, landmark: "Chocolate Hills", landmarkImage: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&q=80" },
  { code: "VN", name: "Vietnam", lat: 14.1, lng: 108.3, landmark: "Ha Long Bay", landmarkImage: "https://images.unsplash.com/photo-1528127269322-539152af5929?w=1600&q=80" },
];

export const countryMap = new Map(countries.map((c) => [c.code, c]));

export function getCountryByCode(code: string): Country | undefined {
  return countryMap.get(code.toUpperCase());
}
