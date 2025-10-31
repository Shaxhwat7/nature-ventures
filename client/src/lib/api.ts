import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Experience {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  duration: string;
  category: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  spotsLeft: number;
}

export interface PromoValidation {
  valid: boolean;
  discount: number;
  message: string;
}

export interface BookingRequest {
  experienceId: string;
  slotId: string;
  name: string;
  email: string;
  quantity:number;
  promoCode?: string;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message: string;
}

const mockExperiences: Experience[] = [
  {
    id: '1',
    title: 'Kayaking',
    location: 'Udupi',
    price: 999,
    image: '../assets/kayaking.jpg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    rating: 4.9,
    reviewCount: 324,
    duration: '3 hours',
    category: 'Water Activities',
  },
  {
    id: '2',
    title: 'Mountain Hiking Experience',
    location: 'Swiss Alps, Switzerland',
    price: 95,
    image: '/placeholder.svg',
    description: 'Trek through breathtaking alpine landscapes with an experienced guide. Discover hidden trails, pristine lakes, and panoramic mountain views.',
    rating: 4.8,
    reviewCount: 267,
    duration: '5 hours',
    category: 'Adventure',
  },
  {
    id: '3',
    title: 'Wine Tasting Tour',
    location: 'Tuscany, Italy',
    price: 85,
    image: '/placeholder.svg',
    description: 'Savor the finest Italian wines in the heart of Tuscany. Visit family-owned vineyards and learn the art of winemaking from local experts.',
    rating: 4.7,
    reviewCount: 189,
    duration: '4 hours',
    category: 'Food & Wine',
  },
  {
    id: '4',
    title: 'Cooking Class with Chef',
    location: 'Bangkok, Thailand',
    price: 65,
    image: '/placeholder.svg',
    description: 'Learn to cook authentic Thai cuisine from a professional chef. Visit local markets and prepare a complete traditional meal.',
    rating: 4.9,
    reviewCount: 412,
    duration: '3.5 hours',
    category: 'Food & Wine',
  },
  {
    id: '5',
    title: 'Desert Safari Adventure',
    location: 'Dubai, UAE',
    price: 150,
    image: '/placeholder.svg',
    description: 'Experience the thrill of dune bashing in the Arabian desert. Includes camel riding, traditional dinner, and cultural performances.',
    rating: 4.8,
    reviewCount: 543,
    duration: '6 hours',
    category: 'Adventure',
  },
  {
    id: '6',
    title: 'Historic City Walking Tour',
    location: 'Prague, Czech Republic',
    price: 45,
    image: '/placeholder.svg',
    description: 'Explore Prague\'s medieval streets and discover centuries of history. Visit the famous castle, Charles Bridge, and hidden courtyards.',
    rating: 4.6,
    reviewCount: 298,
    duration: '3 hours',
    category: 'Cultural',
  },
];

const mockSlots: Record<string, TimeSlot[]> = {
  '1': [
    { id: 's1', date: '2024-12-01', time: '14:00', available: true, spotsLeft: 8 },
    { id: 's2', date: '2024-12-01', time: '18:00', available: true, spotsLeft: 3 },
    { id: 's3', date: '2024-12-02', time: '14:00', available: true, spotsLeft: 12 },
    { id: 's4', date: '2024-12-02', time: '18:00', available: false, spotsLeft: 0 },
    { id: 's5', date: '2024-12-03', time: '14:00', available: true, spotsLeft: 6 },
  ],
};

export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await api.get('/experiences');
    return response.data;
  } catch (error) {
    console.log('Using mock data for experiences');
    return mockExperiences;
  }
};

export const getExperienceById = async (id: string): Promise<Experience> => {
  try {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for experience details');
    const experience = mockExperiences.find((exp) => exp.id === id);
    if (!experience) throw new Error('Experience not found');
    return experience;
  }
};

export const getSlotsForExperience = async (experienceId: string): Promise<TimeSlot[]> => {
  try {
    const response = await api.get(`/experiences/${experienceId}/slots`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for slots');
    return mockSlots[experienceId] || mockSlots['1'];
  }
};

export const validatePromoCode = async (code: string): Promise<PromoValidation> => {
  try {
    const response = await api.post('/promo/validate', { code });
    return response.data;
  } catch (error) {
    console.log('Using mock promo validation');
    if (code.toUpperCase() === 'SAVE10') {
      return { valid: true, discount: 10, message: '10% discount applied!' };
    }
    if (code.toUpperCase() === 'WELCOME20') {
      return { valid: true, discount: 20, message: '20% discount applied!' };
    }
    return { valid: false, discount: 0, message: 'Invalid promo code' };
  }
};

export const createBooking = async (booking: BookingRequest): Promise<BookingResponse> => {
  try {
    const response = await api.post('/bookings', booking);
    return response.data;
  } catch (error) {
    return {
      success: true,
      bookingId: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: 'Booking confirmed successfully!',
    };
  }
};

export async function decrementSlot(slotId: string) {
  const res = await axios.put(`http://localhost:3001/slots/${slotId}/decrement`);
  return res.data;
}