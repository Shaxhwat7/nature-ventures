import { useLocation, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { success, bookingId } = location.state || {};

  if (!location.state) {
    navigate('/');
    return null;
  }

  return (
    <>
      <NavBar onSearch={() => {}} isSearchEnabled={false} />

      {success ? (
        <div className="flex flex-col items-center justify-center text-center mt-[167px]">
          <div className="w-20 h-20 rounded-full bg-[#24AC39] grid place-items-center">
            <Check className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-[24px] font-semibold text-[#161616] mt-4">
            Booking Confirmed
          </h1>

          <p className="text-[16px] text-[#656565] mt-2">
            Ref ID: {bookingId}
          </p>

          <Button
            onClick={() => navigate('/')}
            className="mt-4 w-[175px] h-9 bg-[#E3E3E3] text-[#656565] hover:bg-gray-300"
          >
            Back to Home
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-red-500 grid place-items-center">
            <X className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[24px] font-semibold text-[#E3E3E3] mt-4">
            Booking Failed
          </h1>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Try Again
          </Button>
        </div>
      )}
    </>
  );
};

export default Result;
