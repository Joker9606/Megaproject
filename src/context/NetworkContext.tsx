import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceItem, VerifiedPro, CategoryGroup, NeighborhoodHotspot } from '../types';
import { ALL_SERVICES_DATA, DEFAULT_CATEGORY_GROUPS, INITIAL_VERIFIED_PROS } from '../data/mockData';
import { formatINR } from '../utils/formatCurrency';
import { isFirebaseConfigured } from '../firebase/config';
import { subscribeToWorkers } from '../firebase/services';

interface NetworkContextType {
  services: ServiceItem[];
  pros: VerifiedPro[];
  categories: CategoryGroup[];
  hotspots: NeighborhoodHotspot[];
  addCustomService: (newService: Partial<ServiceItem> & { name: string; category: string }) => ServiceItem;
  registerPro: (proData: {
    id?: string;
    name: string;
    avatar?: string;
    serviceName: string;
    serviceId: string;
    hourlyRate: string;
    neighborhood: string;
    bio: string;
    phone?: string;
    email?: string;
    isEmergencyReady?: boolean;
    customCategory?: string;
  }) => VerifiedPro;
  addCategoryGroup: (name: string, description?: string) => CategoryGroup;
  deletePro: (id: string) => void;
  resetToDefaults: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_SERVICES = 'smart_neighborhood_services_inr_v4';
const LOCAL_STORAGE_KEY_PROS = 'smart_neighborhood_pros_inr_v4';
const LOCAL_STORAGE_KEY_CATEGORIES = 'smart_neighborhood_categories_inr_v4';

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Services State
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SERVICES);
      if (saved) {
        const parsed: ServiceItem[] = JSON.parse(saved);
        return parsed.map((s) => ({
          ...s,
          startingPrice: formatINR(s.startingPrice),
        }));
      }
    } catch {
      // fallback
    }
    return ALL_SERVICES_DATA;
  });

  // 2. Pros State
  const [pros, setPros] = useState<VerifiedPro[]>(() => {
    try {
      const savedPros = localStorage.getItem(LOCAL_STORAGE_KEY_PROS);
      const savedWorkers = localStorage.getItem('smart_neighborhood_workers_v3');
      
      let prosList: VerifiedPro[] = [];
      if (savedPros) {
        prosList = JSON.parse(savedPros);
      }
      
      if (savedWorkers) {
        const workers = JSON.parse(savedWorkers);
        workers.forEach((w: {
          id: string;
          name: string;
          email: string;
          phone: string;
          avatar?: string;
          serviceName: string;
          serviceId: string;
          hourlyRate: string;
          neighborhood: string;
          emergencyReady?: boolean;
          bio?: string;
          rating?: number;
          reviewsCount?: number;
          isAvailableNow?: boolean;
        }) => {
          if (!prosList.some((p) => p.id === w.id || p.email === w.email)) {
            prosList.push({
              id: w.id,
              name: w.name,
              avatar: w.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              service: w.serviceName,
              serviceId: w.serviceId,
              rating: w.rating || 5.0,
              reviewsCount: w.reviewsCount || 0,
              distance: '0.8 km away',
              neighborhood: w.neighborhood || 'Indiranagar / 100ft Road',
              isAvailableNow: w.isAvailableNow ?? true,
              isEmergencyReady: w.emergencyReady ?? true,
              hourlyRate: formatINR(w.hourlyRate || '249'),
              badges: ['Aadhaar Verified', 'Police Checked', 'Top Rated'],
              bio: w.bio || `Certified neighborhood professional in ${w.serviceName}.`,
              completedCount: 0,
              joinedYear: '2026',
              phone: w.phone,
              email: w.email,
            });
          }
        });
      }

      return prosList.map((p) => ({
        ...p,
        hourlyRate: formatINR(p.hourlyRate),
      }));
    } catch {
      // fallback
    }
    return INITIAL_VERIFIED_PROS;
  });

  // 3. Category Groups State
  const [categories, setCategories] = useState<CategoryGroup[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CATEGORY_GROUPS;
  });

  // Firestore Live Listener for Pro registrations
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsub = subscribeToWorkers((liveWorkers) => {
      setPros((prev) => {
        const merged = [...prev];
        liveWorkers.forEach((w) => {
          const existingIdx = merged.findIndex((p) => p.id === w.id || p.email === w.email);
          const proObj: VerifiedPro = {
            id: w.id,
            name: w.name,
            avatar: w.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            service: w.serviceName,
            serviceId: w.serviceId,
            rating: w.rating || 5.0,
            reviewsCount: w.reviewsCount || 0,
            distance: '0.5 km away',
            neighborhood: w.neighborhood || 'Indiranagar / 100ft Road',
            isAvailableNow: w.isAvailableNow ?? true,
            isEmergencyReady: w.emergencyReady ?? true,
            hourlyRate: formatINR(w.hourlyRate || '249'),
            badges: ['Aadhaar Verified', 'Police Checked', 'Firebase Synced'],
            bio: w.bio || `Certified neighborhood professional in ${w.serviceName}.`,
            completedCount: 0,
            joinedYear: '2026',
            phone: w.phone,
            email: w.email,
          };

          if (existingIdx >= 0) {
            merged[existingIdx] = { ...merged[existingIdx], ...proObj };
          } else {
            merged.unshift(proObj);
          }
        });
        return merged;
      });
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error(e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROS, JSON.stringify(pros));
    } catch (e) {
      console.error(e);
    }
  }, [pros]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  // Dynamic 3D Hotspots linked to active pros
  const hotspots: NeighborhoodHotspot[] = pros.map((pro, index) => {
    const angle = (index / Math.max(pros.length, 1)) * Math.PI * 2;
    const radius = 1.8 + (index % 3) * 0.5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return {
      id: `spot-${pro.id}`,
      name: pro.neighborhood || 'Local Locality',
      service: pro.service,
      proName: pro.name,
      position: [Number(x.toFixed(2)), 0.6, Number(z.toFixed(2))],
      color: pro.isEmergencyReady ? '#EF4444' : '#06B6D4',
      status: pro.isEmergencyReady ? 'emergency' : pro.isAvailableNow ? 'available' : 'on-job',
      distance: pro.distance || '0.8 km',
      rating: pro.rating,
    };
  });

  // Add category group
  const addCategoryGroup = (name: string, description?: string): CategoryGroup => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = categories.find((c) => c.id === id);
    if (existing) return existing;

    const newGroup: CategoryGroup = {
      id,
      name,
      icon: 'Sparkles',
      description: description || `Community created: ${name}`,
    };
    setCategories((prev) => [...prev, newGroup]);
    return newGroup;
  };

  // Add custom service / category
  const addCustomService = (newServiceData: Partial<ServiceItem> & { name: string; category: string }): ServiceItem => {
    const id = newServiceData.id || newServiceData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Ensure category group exists
    if (newServiceData.categoryGroup) {
      addCategoryGroup(newServiceData.categoryGroup);
    }

    const price = formatINR(newServiceData.startingPrice || '299');

    const created: ServiceItem = {
      id,
      name: newServiceData.name,
      category: newServiceData.category,
      categoryGroup: newServiceData.categoryGroup || 'Custom Services',
      icon: newServiceData.icon || 'Sparkles',
      shortDesc: newServiceData.shortDesc || `Verified ${newServiceData.name} service for your neighborhood.`,
      description: newServiceData.description || `Community-listed professional service for ${newServiceData.name}. Fully insured and background checked.`,
      avgResponseTime: newServiceData.avgResponseTime || 'Same Day',
      startingPrice: price,
      rating: 5.0,
      completedJobs: 1,
      popularServices: newServiceData.popularServices || ['Custom Neighborhood Service', 'Initial Consultation'],
      gradient: newServiceData.gradient || 'from-cyan-500/20 to-blue-500/10',
      badge: 'New Service',
      isEmergencyAvailable: newServiceData.isEmergencyAvailable ?? false,
      isCustom: true,
    };

    setServices((prev) => {
      const exists = prev.find((s) => s.id === id);
      if (exists) return prev.map((s) => (s.id === id ? { ...s, ...created } : s));
      return [created, ...prev];
    });

    return created;
  };

  // Register Worker / Pro
  const registerPro = (data: {
    id?: string;
    name: string;
    avatar?: string;
    serviceName: string;
    serviceId: string;
    hourlyRate: string;
    neighborhood: string;
    bio: string;
    phone?: string;
    email?: string;
    isEmergencyReady?: boolean;
    customCategory?: string;
  }): VerifiedPro => {
    let finalServiceId = data.serviceId;

    const rate = formatINR(data.hourlyRate || '249');

    // If custom category was specified
    if (data.customCategory && data.customCategory.trim() !== '') {
      const createdService = addCustomService({
        name: data.customCategory,
        category: 'custom',
        categoryGroup: 'Custom Services',
        startingPrice: rate,
        isEmergencyAvailable: data.isEmergencyReady,
      });
      finalServiceId = createdService.id;
    }

    const newPro: VerifiedPro = {
      id: data.id || `pro-${Date.now()}`,
      name: data.name,
      avatar: data.avatar || `https://images.unsplash.com/photo-${1507003211169 + (pros.length % 10)}?w=150&auto=format&fit=crop&q=80`,
      service: data.serviceName,
      serviceId: finalServiceId,
      rating: 5.0,
      reviewsCount: 1,
      distance: '0.6 km away',
      neighborhood: data.neighborhood || 'Local Locality',
      isAvailableNow: true,
      isEmergencyReady: data.isEmergencyReady ?? true,
      hourlyRate: rate,
      badges: ['Aadhaar Verified', 'Police Checked', 'Top Rated'],
      bio: data.bio || `Experienced local specialist in ${data.serviceName}.`,
      completedCount: 1,
      joinedYear: '2026',
      phone: data.phone,
      email: data.email,
    };

    setPros((prev) => [newPro, ...prev]);
    return newPro;
  };

  // Delete Pro
  const deletePro = (id: string) => {
    setPros((prev) => prev.filter((p) => p.id !== id));
  };

  // Reset
  const resetToDefaults = () => {
    setServices(ALL_SERVICES_DATA);
    setPros(INITIAL_VERIFIED_PROS);
    setCategories(DEFAULT_CATEGORY_GROUPS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SERVICES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PROS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CATEGORIES);
  };

  return (
    <NetworkContext.Provider
      value={{
        services,
        pros,
        categories,
        hotspots,
        addCustomService,
        registerPro,
        addCategoryGroup,
        deletePro,
        resetToDefaults,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
