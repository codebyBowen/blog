"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../utils/supabase";
import avatar from "../public/avatar/user_default_1.jpeg";
import logo from "../public/thebowveelogo.png";
import NewsletterPopup from "@/components/NewsletterPopup";

type User = { id: string; username: string } | null;

export default function TopBar() {
  const [user, setUser] = useState<User>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSolutionsMenu, setShowSolutionsMenu] = useState(false);
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({
          id: user.id,
          username: user.user_metadata.username || "User",
        });
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <nav className="navbar bg-white dark:bg-gray-900">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <Image
              src={logo}
              alt="EQL Logo"
              width={100}
              style={{
                width: "auto",
              }}
            />
          </Link>

          {/* Hamburger menu for mobile */}
          <button 
            className="md:hidden float-right p-2 text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          {/* Navigation Menu */}
          <ul className={`navbar-menu ${isMenuOpen ? 'block' : 'hidden'} md:flex`}>
            {/* Platform Dropdown */}
            <li
              className="navbar-item dropdown"
              onMouseEnter={() => setShowPlatformMenu(true)}
              onMouseLeave={() => setShowPlatformMenu(false)}
            >
              <button className="navbar-link text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400">Platform</button>
              {showPlatformMenu && (
                <ul className="dropdown-menu bg-white dark:bg-gray-800">
                  <li>
                    <Link href="/overview" className="dropdown-link text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400">
                      Overview
                    </Link>
                  </li>
                  {/* <li>
                    <Link href="/runfair" className="dropdown-link text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400">
                      What is Run Fair?
                    </Link>
                  </li> */}
                  {/* Add more menu items */}
                </ul>
              )}
            </li>


            {/* <li className="navbar-item">
              <Link href="/" className="navbar-link text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400">
                Pricing
              </Link>
            </li> */}
            <li className="navbar-item">
              <button
                onClick={() => setShowPopup(true)}
                className="navbar-link text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400"
              >
                Newsletter
              </button>
            </li>
          </ul>

          {/* User Menu */}
          <div className="navbar-buttons">
            {user ? (
              <div className="user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-button text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400"
                >
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="user-avatar"
                  />
                  <span>{user.username}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown bg-white dark:bg-gray-800">
                    <Link href="/profile" className="dropdown-item text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400">
                      Edit Profile
                    </Link>
                    <button onClick={handleSignOut} className="dropdown-item text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link href="/contact" className="btn btn-primary text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400">
                  Contact Us
                </Link>
                <Link href="/login" className="btn btn-secondary text-black dark:text-white hover:text-yellow-400 dark:hover:text-yellow-400">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <NewsletterPopup />
          </div>
        </div>
      )}
    </>
  );
}
