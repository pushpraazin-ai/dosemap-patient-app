import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginFlowScreen } from './components/LoginFlowScreen';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { BottomNavBar, NavTabId } from './components/BottomNavBar';
import { getOrderCart } from './services/orderStorage';
import { ScreenType } from './types';
import { Layers, LogOut } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('doseMap_isLoggedIn') === 'true';
    } catch {
      return false;
    }
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    try {
      const logged = localStorage.getItem('doseMap_isLoggedIn') === 'true';
      return logged ? 'dashboard' : 'login';
    } catch {
      return 'login';
    }
  });

  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [showScreenNav, setShowScreenNav] = useState(false);
  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      return getOrderCart().filter((i) => i.selected).length;
    } catch {
      return 2;
    }
  });

  // Keep cart count synchronized with storage
  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = getOrderCart();
        setCartCount(cart.filter((i) => i.selected).length);
      } catch {
        // fallback
      }
    };

    window.addEventListener('storage', updateCart);
    const interval = setInterval(updateCart, 2000);
    return () => {
      window.removeEventListener('storage', updateCart);
      clearInterval(interval);
    };
  }, []);

  const handleTabChange = (tab: NavTabId) => {
    setActiveTab(tab);
    setCurrentScreen('dashboard');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('doseMap_isLoggedIn');
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  // Determine active view: If not logged in, enforce 4-step Login flow as FIRST screen
  const effectiveScreen: ScreenType = !isLoggedIn ? 'login' : currentScreen;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0A2E65] relative overflow-x-hidden font-sans">
      {/* Floating Offline Status Bar across all screens */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 w-full bg-[#FF7A00] text-white py-2 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg z-[9999]">
          <span>📴 Offline - डेटा फोन मध्ये सुरक्षित आहे</span>
        </div>
      )}

      {/* Screen Views */}
      <AnimatePresence mode="wait">
        {/* FIRST SCREEN: EXACT 4-STEP LOGIN FLOW (No skipping) */}
        {effectiveScreen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            <LoginFlowScreen onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {effectiveScreen === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen relative"
          >
            <SplashScreen onContinue={() => setCurrentScreen('dashboard')} />
            <BottomNavBar
              activeTab="splash"
              onTabChange={handleTabChange}
              cartCount={cartCount}
            />
          </motion.div>
        )}

        {effectiveScreen === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen relative"
          >
            <OnboardingScreen onComplete={() => setCurrentScreen('dashboard')} />
            <BottomNavBar
              activeTab="onboarding"
              onTabChange={handleTabChange}
              cartCount={cartCount}
            />
          </motion.div>
        )}

        {effectiveScreen === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            <DashboardScreen
              onBackToSplash={() => setCurrentScreen('splash')}
              onBackToOnboarding={() => setCurrentScreen('onboarding')}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
