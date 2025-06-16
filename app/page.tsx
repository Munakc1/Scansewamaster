'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

export default function LoginPage() {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem('loggedIn') === 'true') {
      router.replace('/dashboard');
    }
  }, [router]);

  // Mount animation using Anime.js
  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [-40, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (!phone.match(/^\d{10}$/)) {
      setHasError(true);
      return;
    }

    setHasError(false);
    localStorage.setItem('loggedIn', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div
        ref={cardRef}
        className="w-full max-w-md p-8 sm:p-10 bg-white rounded-2xl shadow-lg border border-gray-300 transition-transform duration-300 hover:scale-105"
      >
        <h2 className="text-3xl font-bold mb-2 text-[#023E8A] text-center tracking-wide">
          Dashboard
        </h2>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Please sign in to your dashboard
        </p>

        {hasError && (
          <p className="mb-4 text-center text-red-600 font-medium text-sm">
            Please enter a valid 10-digit phone number.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="9876543210"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077B6] transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077B6] transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0077B6] text-white font-semibold py-3 rounded-lg shadow-sm transition-all duration-300 hover:bg-white hover:text-[#0077B6] hover:border-[#0077B6] border border-transparent"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-center mt-6 text-gray-500">
          By signing in, you agree to our{' '}
          <span className="text-[#0077B6] font-semibold hover:underline cursor-pointer">
            Terms
          </span>{' '}
          and{' '}
          <span className="text-[#0077B6] font-semibold hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
