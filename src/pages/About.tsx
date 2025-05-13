import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl py-12">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="group flex items-center gap-1"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-michroma font-bold gradient-text">About AlgoWave</h1>
          
          <div className="prose prose-lg dark:prose-invert">
            <p>
              AlgoWave is a comprehensive CPU scheduling and resource allocation algorithm simulator 
              designed to help students, educators, and professionals understand the fundamentals of 
              operating system process management and resource allocation.
            </p>
            
            <p>
              Our interactive simulation platform provides visual demonstrations of various CPU scheduling 
              algorithms such as First-Come-First-Served (FCFS), Shortest Job First (SJF), Priority Scheduling, 
              and Round Robin. Additionally, we feature resource allocation algorithms like Banker's Algorithm 
              to visualize deadlock avoidance techniques.
            </p>
            
            <p>
              With AlgoWave, users can:
            </p>
            
            <ul>
              <li>Visualize how different scheduling algorithms work with custom process inputs</li>
              <li>Compare algorithm performance through metrics like average waiting time and turnaround time</li>
              <li>Understand deadlock scenarios and avoidance strategies</li>
              <li>Experiment with different parameters to see their impact on system performance</li>
            </ul>
            
            <p>
              This project was developed to make complex operating system concepts more accessible and 
              interactive, enabling better understanding through visualization and experimentation.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-6 md:py-0 md:h-16 border-t">
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
    </div>
  );
};

export default About; 