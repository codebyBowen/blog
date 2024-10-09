"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../utils/supabase";
import avatar from "../public/avatar/user_default_1.jpeg";
import logo from "../public/logo.png";
import NewsletterPopup from "@/components/NewsletterPopup";

type User = { id: string; username: string } | null;

export default function TopBar() {
  const [user, setUser] = useState<User>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSolutionsMenu, setShowSolutionsMenu] = useState(false);
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <Image
              src={logo}
              alt="EQL Logo"
              width={100}
              // height={100}
              style={{
                width: "auto",
                // height: 'auto',
              }}
            />
          </Link>

          {/* Navigation Menu */}
          <ul className="navbar-menu">
            {/* Platform Dropdown */}
            <li
              className="navbar-item dropdown"
              onMouseEnter={() => setShowPlatformMenu(true)}
              onMouseLeave={() => setShowPlatformMenu(false)}
            >
              <button className="navbar-link">Platform</button>
              {showPlatformMenu && (
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/overview" className="dropdown-link">
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link href="/runfair" className="dropdown-link">
                      What is Run Fair?
                    </Link>
                  </li>
                  {/* 添加更多菜单项 */}
                </ul>
              )}
            </li>

            {/* Resources Dropdown */}
            <li
              className="navbar-item dropdown"
              onMouseEnter={() => setShowResourcesMenu(true)}
              onMouseLeave={() => setShowResourcesMenu(false)}
            >
              <button className="navbar-link">Resources</button>
              {showResourcesMenu && (
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/news" className="dropdown-link">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/newsletter" className="dropdown-link">
                      Newsletter
                    </Link>
                  </li>
                  {/* 添加更多菜单项 */}
                </ul>
              )}
            </li>

            <li className="navbar-item">
              <Link href="/" className="navbar-link">
                Pricing
              </Link>
            </li>
            <li className="navbar-item">
              <button
                onClick={() => setShowPopup(true)}
                className="navbar-link"
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
                  className="user-button"
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
                  <div className="user-dropdown">
                    <Link href="/profile" className="dropdown-item">
                      Edit Profile
                    </Link>
                    <button onClick={handleSignOut} className="dropdown-item">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <></>
              // <div className="auth-buttons">
              //   <Link href="/" className="btn btn-primary">
              //     Contact Sales
              //   </Link>
              //   <Link href="/login" className="btn btn-secondary">
              //     Retailer Login
              //   </Link>
              // </div>
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
