
export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  duration: string;
  rating: number;
  genres: string[];
  moods: string[];
  poster_path?: string;
}

export const genres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller'
];

export const moods = [
  'Excited',
  'Happy',
  'Thoughtful',
  'Melancholic',
  'Tense',
  'Inspired',
  'Nostalgic'
];

export const videoClipUrl = "https://www.youtube.com/embed/zSWdZVtXT7E";

export const moviePosters = [
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
]