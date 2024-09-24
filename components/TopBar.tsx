"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../utils/supabase";
import avatar from "../public/avatar/user_default_1.jpeg"

export default function TopBar() {
  const [user, setUser] = useState<object[] | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // const { data: profile } = await supabase
        //   .from("profiles")
        //   .select("*")
        //   .eq("id", user.id)
        //   .single();
        setUser({ ...user });

        // Set avatar URL
        // if (profile?.profile_image_url) {
        //   const { data } = supabase.storage
        //     .from("user_profile_image")
        //     .getPublicUrl("user_default_1.jpeg");
        //   setAvatarUrl(data.publicUrl);
        // } else {
        //   setAvatarUrl(profile?.profile_image_url);
        // }
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  console.log("user", user);

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          My Blog
        </Link>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <Image
              src={user?.profile?.profile_image_url || avatar}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
            <span className="text-gray-700 dark:text-gray-300">
              {user.username}
            </span>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md overflow-hidden shadow-xl z-10">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
