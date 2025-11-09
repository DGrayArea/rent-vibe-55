"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/hero-housing.jpg)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Find Your Perfect Student Home
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
          Discover verified, affordable housing near your campus. Safe,
          comfortable, and hassle-free.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            onClick={() => router.push("/properties")}
          >
            <Search className="mr-2 h-5 w-5" />
            Browse Properties
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white dark:bg-secondary hover:bg-white/90 dark:hover:bg-secondary/80 text-primary dark:text-primary-foreground shadow-lg"
            onClick={() => router.push("/auth")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
