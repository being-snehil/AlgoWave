import { useRef, RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  featureSectionRef: RefObject<HTMLDivElement>;
}

const HeroSection = ({ featureSectionRef }: HeroSectionProps) => {
  const scrollToFeatures = () => {
    featureSectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="relative container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 text-center overflow-hidden md:pt-12 pt-8">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_1%,transparent_100%)]"></div>
        <div className="animate-fade-in space-y-4 max-w-3xl relative z-10">
          <button className="group relative grid overflow-hidden rounded-full px-6 py-2 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200 mx-auto w-fit">
            <span>
                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
            </span>
            <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
            <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/40"></span>
            <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1.5">
                <img src="/sparkles-dark.svg" alt="✨" width={24} height={24} className="w-4 h-4" />
                Introducing ALGO WAVE
                <ChevronRight className="w-4 h-4" />
            </span>
          </button>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-8 font-gilroy tracking-tight">
            Visualize{' '}
            <span className="gradient-text">CPU Scheduling Algorithms</span>{' '}
            Like Never Before!
          </h1>
          
          {/* Mobile-only Get Started button */}
          <div className="block sm:hidden mt-6">
            <Button 
              onClick={scrollToFeatures} 
              className="rounded-full font-gilroy border border-foreground/20 bg-gradient-to-r from-primary/80 to-secondary/80"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="hidden md:flex relative items-center justify-center mt-8 md:mt-12 w-full">
            <Link to="#" className="flex items-center justify-center w-max rounded-full border-t border-foreground/30 bg-white/20 backdrop-blur-lg px-2 py-1 md:py-2 gap-2 md:gap-8 shadow-3xl shadow-background/40 cursor-pointer select-none">
              <p className="text-foreground text-sm text-center md:text-base font-medium font-gilroy pl-4 pr-4 lg:pr-0">
                ✨ {"  "} Learn and simulate First Come First Serve, Shortest Job First, SRTF, HRRN, and Banker's Algorithm — with live animations and real-time feedback.
              </p>
              <Button size="sm" onClick={scrollToFeatures} className="rounded-full hidden lg:flex border font-gilroy border-foreground/20">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
