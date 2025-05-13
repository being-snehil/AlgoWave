
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AlgorithmCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
}

const AlgorithmCard = ({ title, description, icon, path }: AlgorithmCardProps) => {
  return (
    <Card className="overflow-hidden card-hover border border-white/10 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="mb-3 text-primary w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 shadow-inner">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Click below to visualize how the {title} algorithm works in action.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full gradient-bg btn-pulse">
          <Link to={path}>Visualize</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlgorithmCard;
