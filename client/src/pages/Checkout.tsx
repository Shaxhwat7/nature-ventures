import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validatePromoCode, createBooking, decrementSlot } from '@/lib/api';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  price?: number;
}

interface SelectedSlot {
  id: string;
  date: string;
  time:string;
}

interface CheckoutState {
  experienceId: string;
  slotId: string;
  experience: Experience;
  slot: SelectedSlot;
  quantity: number;
  subtotal?: number;
  taxes?: number;
  total?: number;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { experienceId, slotId, experience, slot, quantity, subtotal: stateSubtotal, taxes: stateTaxes, total: stateTotal } = (location.state || {}) as Partial<CheckoutState>;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    promoCode: '',
  });

  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!experienceId || !slotId || !experience || !slot) {
      navigate('/');
    }
  }, [experienceId, slotId, experience, slot, navigate]);

  if (!experience || !slot) {
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim()) return;

    setPromoValidating(true);
    try {
      const result = await validatePromoCode(formData.promoCode);
      if (result.valid) {
        setPromoDiscount(result.discount);
        setPromoApplied(true);
        toast.success(result.message || 'Promo code applied!');
      } else {
        setPromoDiscount(0);
        setPromoApplied(false);
        toast.error(result.message || 'Invalid promo code');
      }
    } catch (error) {
      toast.error('Failed to validate promo code');
    } finally {
      setPromoValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createBooking({
        experienceId: experienceId as string,
        slotId: slotId as string,
        name: formData.name.trim(),
        quantity: quantity as number,
        email: formData.email.trim(),
        promoCode: promoApplied ? formData.promoCode : undefined,
      });

      if (result.success) {
        await decrementSlot(slotId as string);

        navigate('/result', {
          state: {
            success: true,
            bookingId: result.bookingId,
            message: result.message,
            experience,
            slot,
            totalAmount: finalTotal,
          },
        });
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      navigate('/result', {
        state: {
          success: false,
          message: 'Booking failed. Please try again.',
        },
      });
    } finally {
      setSubmitting(false);
    }
  };


  const unitPrice = Number(experience.price ?? 0);
  const qty = Number.isFinite(quantity) && quantity! > 0 ? (quantity as number) : 1;
  const baseSubtotal = typeof stateSubtotal === 'number' ? stateSubtotal! : unitPrice * qty;
  const baseTaxes = typeof stateTaxes === 'number' ? stateTaxes! : Math.round(baseSubtotal * 0.059);
  const baseTotal = typeof stateTotal === 'number' ? stateTotal! : baseSubtotal + baseTaxes;

  const discount = (baseSubtotal * promoDiscount) / 100;
  const finalTotal = Math.max(0, Math.round(baseTotal - discount));

  return (
      <div className="mx-auto px-4 pt-24 pb-8 lg:pt-28 w-full max-w-[1158px]">
        <NavBar onSearch={() => {}} isSearchEnabled={false} />

        <button onClick={() => navigate(-1)} className=" text-sm flex items-center gap-2 text-black">
          <ChevronLeft className="w-4 h-4" /> Checkout
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[739px_387px] justify-between gap-8">
          <div className="w-full lg:w-[739px] h-auto lg:min-h-[198px] rounded-[12px] border border-[#E6E6E6] bg-[#F6F6F6] px-5 py-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-5">
                <div className="space-y-1">
                  <Label className="text-[12px] text-[#5B5B5B]">Full name</Label>
                  <div className="w-[334px]">
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" maxLength={100} className={`h-[42px] text-[13px] ${errors.name ? 'border-destructive' : ''}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[12px] text-[#5B5B5B]">Email</Label>
                  <div className="w-[334px]">
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="test@test.com" maxLength={255} className={`h-[42px] text-[13px] ${errors.email ? 'border-destructive' : ''}`} />
                  </div>
                </div>
              </div>
              <div className="grid lg:hidden grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label className="text-[18px] text-[#5B5B5B]">Full name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className={`h-[42px] ${errors.name ? 'border-destructive' : ''}`} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[18px] text-[#5B5B5B]">Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="test@test.com" className={`h-[42px] ${errors.email ? 'border-destructive' : ''}`} />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                <div className="space-y-1">
                  <Label className="text-[12px] text-gray-700">Promo code</Label>
                  <div className="lg:w-[604px]">
                    <Input value={formData.promoCode} onChange={(e) => { setFormData({ ...formData, promoCode: e.target.value }); setPromoApplied(false); }} placeholder="Promo code" disabled={promoApplied} className="h-[42px] text-[13px]" />
                  </div>
                </div>
                <button type="button" onClick={handleApplyPromo} disabled={promoValidating || promoApplied || !formData.promoCode.trim()} className="bg-black text-white h-[42px] px-4 rounded-md">
                  {promoValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </div>

              <label className="flex items-center gap-2 text-[12px] text-gray-600">
                <input type="checkbox" className="w-3 h-3 rounded border-gray-300" />
                I agree to the terms and safety policy
              </label>
            </form>
          </div>

          <aside className="w-full lg:w-[387px]">
            <div className="rounded-[14px]  bg-[#F8F8F8] p-5">
              <div className="grid grid-cols-[1fr_auto] gap-y-2 text-[15px]">
                <div className="text-[#656565]">Experience</div>
                <div className="text-right">{experience.title}</div>

                <div className="text-[#656565]">Date</div>
                <div className="text-right">{slot.date}</div>

                <div className="text-[#656565]">Time</div>
                <div className="text-right">{slot.time}</div>

                <div className="text-[#656565]">Qty</div>
                <div className="text-right">{qty}</div>

                <div className="col-span-2 border-t my-2 border-[#E7E7E7]" />

                <div className="text-[#656565]">Subtotal</div>
                <div className="text-right">₹{baseSubtotal.toLocaleString('en-IN')}</div>

                <div className="text-[#656565]">Taxes</div>
                <div className="text-right">₹{baseTaxes.toLocaleString('en-IN')}</div>

                {promoApplied && (
                  <>
                    <div className="text-gray-600">Discount ({promoDiscount}%)</div>
                    <div className="text-right text-green-600">-₹{Math.round(discount).toLocaleString('en-IN')}</div>
                  </>
                )}

                <div className="col-span-2 border-t my-2 border-[#D9D9D9]" />

                <div className="font-semibold text-[18px]">Total</div>
                <div className="text-right font-semibold text-[18px]">₹{finalTotal.toLocaleString('en-IN')}</div>
              </div>

              <button className="w-full h-11 rounded-lg bg-[#FACC15] text-black hover:bg-[#FACC15]/90" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                  </>
                ) : (
                  'Pay and Confirm'
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
  );
};

export default Checkout;
