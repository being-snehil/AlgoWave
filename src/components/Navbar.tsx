import { RefObject, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between md:justify-center">
        <div className="flex  items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            {/* <img src="/algowavee.svg" alt="AlgoWave Logo" className="h-8 w-auto rounded-xl scale-125 mr-4" /> */}
            <span className="text-3xl font-michroma font-extrabold tracking-wide gradient-text">Algo<span className="font-lovely text-2xl">WAVE </span></span>
          </Link>
          
          <nav className="hidden md:flex font-michroma items-center gap-6">
            {/* <Link to="/algorithm/fcfs" className="text-sm font-medium transition-colors hover:text-primary">
              Algorithms
            </Link>
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link> */}
          </nav>
        </div>
        
        <div className="flex font-michroma items-center gap-4">
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/algorithm/fcfs" className="text-sm font-medium transition-colors hover:text-primary">
              Algorithms
            </Link>
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Documentation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
