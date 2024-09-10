"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import {
  ArrowBigUp,
  Github,
  Loader,
  LogOut,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Header() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    console.log(theme);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const user = auth.currentUser;
  const router = useRouter();

  return (
    <header className="py-4 border-b">
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4"
        onClick={scrollToTop}
      >
        <ArrowBigUp />
      </Button>
      {user && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-16 right-4"
          onClick={() => {
            signOut(auth);
            router.push("/");
          }}
        >
          <LogOut />
        </Button>
      )}
      <div className="container flex flex-row justify-between items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] flex flex-col"
            side={"left"}
          >
            <Link href="/" className="text-2xl font-bold">
              FindThePeach
            </Link>
            <Link href="/posts">Posts</Link>
            <Link href="/archive">Archive</Link>
            <Link href="/tag">Tags</Link>
            <Link href="/tool">Tools</Link>
            <Link href="/about">About</Link>
          </SheetContent>
        </Sheet>
        <Link href="/" className="text-xl font-bold md:hidden">
          FindThePeach
        </Link>
        <NavigationMenu className="hidden md:flex flex-row">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="text-xl font-bold">
                  FindThePeach
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/posts" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Posts
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/archive" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Archives
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/tag" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Tags
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/tool" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Tools
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div>
          <Button variant="ghost" size="icon">
            <a href="https://github.com/Jiaqi9972/FindThePeach">
              <Github />
            </a>
          </Button>
          {mounted ? (
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Moon /> : <Sun />}
            </Button>
          ) : (
            <Button variant="ghost" size="icon">
              <Loader />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
