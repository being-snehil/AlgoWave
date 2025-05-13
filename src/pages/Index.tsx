import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import Navbar from '@/components/Navbar';
import { useRef } from 'react';

const Index = () => {
  const featureSectionRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar featureSectionRef={featureSectionRef} />
      <main className="flex-1">
        <HeroSection featureSectionRef={featureSectionRef} />
        <div ref={featureSectionRef}>
          <FeatureSection />
        </div>
        <footer className="py-6 md:py-0 md:h-16 border-t pt-10">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
            <p className="text-sm text-muted-foreground font-gilroyr">
              &copy; {new Date().getFullYear()} AlgoWave. All rights reserved.
            </p>
            <div className='font-gilroyr'>Made With ❤️ By Snehil</div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <a href="https://github.com/being-snehil" className="hover:text-foreground font-gilroyr">GitHub</a>
              <a href="https://www.linkedin.com/in/snehil-verma-1b685b252/" className="hover:text-foreground font-gilroyr">LinkedIn</a>
              <a href="https://x.com/being_snehil" className="hover:text-foreground font-gilroyr">Twitter</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
