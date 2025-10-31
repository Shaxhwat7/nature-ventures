import { useEffect, useState } from 'react';
import { ExperienceCard } from '@/components/ExperienceCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getExperiences, type Experience } from '@/lib/api';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';

const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await getExperiences();
        setExperiences(data);
        setAllExperiences(data)
      } catch (error) {
        toast.error('Failed to load experiences. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setExperiences(allExperiences);
      return;
    }

    const filtered = allExperiences.filter(exp =>
      exp.title.toLowerCase().includes(query.toLowerCase())
    );

    setExperiences(filtered);
  };
  return (
    <>
      <NavBar onSearch={handleSearch} isSearchEnabled={true} />
      <div className="relative w-full min-h-screen bg-[#FAFAFA]">
        {experiences.map((exp, index) => {
          const row = Math.floor(index / 4);
          const col = index % 4;

          const top = 135 + row * 344; 
          const left = 124 + col * 304; 

          return (
            <div
              key={exp.id}
              className="absolute"
              style={{ top: `${top}px`, left: `${left}px` }}
            >
              <ExperienceCard experience={exp} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
