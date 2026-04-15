export const IMAGES = {
  hero: 'https://static.prod-images.emergentagent.com/jobs/cf72b55c-8577-4cbf-aa1f-b2988e3b93ba/images/3a71c315a9127f6f5a5b58bebd530f9141daa2b1a77771fd0a7cdb49f7c0d649.png',
  abstract: 'https://static.prod-images.emergentagent.com/jobs/cf72b55c-8577-4cbf-aa1f-b2988e3b93ba/images/56dd8f1e3a3d28703d6ce1e467c7787ce439f82eafc887a67e148bd66e60f170.png',
  security: 'https://static.prod-images.emergentagent.com/jobs/cf72b55c-8577-4cbf-aa1f-b2988e3b93ba/images/be3b64f63bed4e68cdad72821c1dee4501d6539bfbfc991e91ece9eda53e3b3f.png',
  washingMachine: 'https://images.unsplash.com/photo-1761079976271-3a78f547ca67?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBob21lJTIwYXBwbGlhbmNlc3xlbnwwfHx8fDE3NzU5NzcyNDl8MA&ixlib=rb-4.1.0&q=85',
  technician: 'https://images.unsplash.com/photo-1601659404194-97d2daca8383?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxhYyUyMHJlcGFpciUyMHRlY2huaWNpYW58ZW58MHx8fHwxNzc1OTc3MjQ5fDA&ixlib=rb-4.1.0&q=85',
};

export const categories = [
  { id: 'ac', name: 'Air Conditioner', icon: 'Wind', description: 'Installation, repair & maintenance of all AC types', serviceCount: 25, image: IMAGES.hero, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'refrigerator', name: 'Refrigerator', icon: 'Snowflake', description: 'Repair, gas refill & deep cleaning services', serviceCount: 18, image: IMAGES.washingMachine, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  { id: 'washing-machine', name: 'Washing Machine', icon: 'Waves', description: 'Installation, drum cleaning & motor repair', serviceCount: 15, image: IMAGES.washingMachine, color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { id: 'cctv', name: 'CCTV Camera', icon: 'Camera', description: 'Installation, wiring & remote setup', serviceCount: 12, image: IMAGES.security, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 'digital-board', name: 'Digital Board', icon: 'Monitor', description: 'Smart board installation & configuration', serviceCount: 8, image: IMAGES.security, color: 'bg-amber-50 text-amber-600 border-amber-100' },
];

export const services = [
  { id: 's1', name: 'AC Deep Cleaning', category: 'ac', shortDesc: 'Complete indoor and outdoor unit cleaning for optimal performance.', price: 599, originalPrice: 999, rating: 4.8, reviewCount: 124, duration: '60 mins', popular: true, image: 'https://images.unsplash.com/photo-1601659404194-97d2daca8383?auto=format&fit=crop&q=80&w=800' },
  { id: 's2', name: 'Refrigerator Maintenance', category: 'refrigerator', shortDesc: 'Full checkup, cleaning, and gas pressure monitoring.', price: 450, originalPrice: 800, rating: 4.9, reviewCount: 89, duration: '45 mins', popular: true, image: 'https://images.unsplash.com/photo-1571175432230-01c288a39988?auto=format&fit=crop&q=80&w=800' },
  { id: 's3', name: 'Washing Machine Repair', category: 'washing-machine', shortDesc: 'Expert repair for front-load and top-load machines.', price: 799, originalPrice: 1200, rating: 4.7, reviewCount: 156, duration: '90 mins', popular: true, image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800' },
  { id: 's4', name: 'CCTV Installation', category: 'cctv', shortDesc: 'Professional 4-camera setup with remote mobile access.', price: 2499, originalPrice: 3500, rating: 5.0, reviewCount: 42, duration: '4 hours', popular: true, image: 'https://images.unsplash.com/photo-1557597774-9d2739f85a76?auto=format&fit=crop&q=80&w=800' },
  { id: 's5', name: 'Digital Board Setup', category: 'digital-board', shortDesc: 'Smart interactive board installation for classrooms.', price: 1500, originalPrice: 2200, rating: 4.8, reviewCount: 28, duration: '2 hours', popular: true, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800' },
  { id: 's6', name: 'Deep Kitchen Cleaning', category: 'custom', shortDesc: 'Complete degreasing and sanitization of kitchen surfaces.', price: 1200, originalPrice: 1800, rating: 4.9, reviewCount: 65, duration: '3 hours', popular: true, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800' },
];
export const technicians = [];
export const users = [];
export const bookings = [];
export const reviews = [];
export const testimonials = [
  { id: 't1', name: 'Rahul Sharma', role: 'Homeowner', comment: 'FixNow technician arrived on time and fixed my AC perfectly. Very professional service!', rating: 5 },
  { id: 't2', name: 'Priya Singh', role: 'Apartment Resident', comment: 'The washing machine repair was quick and affordable. Highly recommend this platform!', rating: 4 },
  { id: 't3', name: 'Amit Verma', role: 'Business Owner', comment: 'Used their CCTV installation service for my shop. Great quality and neat work.', rating: 5 },
  { id: 't4', name: 'Sneha Patel', role: 'Parent', comment: 'Excellent refrigerator repair service. The technician was knowledgeable and polite.', rating: 5 },
];

export const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

export const locations = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
];
