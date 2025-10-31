import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "@/components/NavBar";

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  price: number;
  about: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  spotsLeft: number;
}

export default function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [groupedSlots, setGroupedSlots] = useState<{ [key: string]: TimeSlot[] }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    axios
      .get<{ experience: Experience; slots: TimeSlot[] }>(`${import.meta.env.VITE_BACKEND_URL}/experiences/${id}`)
      .then((res) => {
        setExperience(res.data.experience);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    axios
      .get<TimeSlot[]>(`${import.meta.env.VITE_BACKEND_URL}/experiences/${id}/slots`)
      .then((res) => {
        const data = res.data;

        const grouped = data.reduce((acc: { [key: string]: TimeSlot[] }, slot) => {
          if (!acc[slot.date]) acc[slot.date] = [];
          acc[slot.date].push(slot);
          return acc;
        }, {});

        const sortedGrouped: { [key: string]: TimeSlot[] } = Object.fromEntries(
          Object.entries(grouped).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        );

        for (const date in sortedGrouped) {
          sortedGrouped[date].sort((a, b) => {
            const t1 = new Date(`1970-01-01T${convertTo24(a.time)}:00`).getTime();
            const t2 = new Date(`1970-01-01T${convertTo24(b.time)}:00`).getTime();
            return t1 - t2;
          });
        }

        setGroupedSlots(sortedGrouped);
        if (!selectedDate) {
          const first = Object.keys(sortedGrouped)[0];
          if (first) setSelectedDate(first);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const convertTo24 = (time: string) => {
    const [t, mod] = time.split(" ");
    let [h, m] = t.split(":").map(Number);
    if (mod.toLowerCase() === "pm" && h !== 12) h += 12;
    if (mod.toLowerCase() === "am" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  if (!experience) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <NavBar onSearch={() => {}} />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8 lg:pt-28 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div>
            <div className="rounded-3xl overflow-hidden shadow-md mb-6 lg:mb-8">
              <img
                src={experience.image}
                alt={experience.title}
                className="w-full h-[380px] lg:h-[420px] object-cover"
              />
            </div>

            <h1 className="text-2xl lg:text-3xl font-semibold mb-2">{experience.title}</h1>
            <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed">
              {experience.description}
            </p>

            <h2 className="text-lg lg:text-xl font-medium mb-2">Choose date</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(groupedSlots).length === 0 ? (
                <p className="text-gray-400">No available dates</p>
              ) : (
                Object.keys(groupedSlots).map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className={`px-4 py-2 rounded-md text-sm ${
                      selectedDate === date
                        ? "bg-[#FFD643] text-black font-medium"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                ))
              )}
            </div>

            <h2 className="text-lg lg:text-xl font-medium mb-2">Choose time</h2>
            {selectedDate && groupedSlots[selectedDate] ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {groupedSlots[selectedDate].map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    disabled={!slot.available || slot.spotsLeft === 0}
                    className={` rounded-md px-3 py-2 text-sm ${
                      slot.available && slot.spotsLeft > 0
                        ? selectedSlot === slot.id
                          ? "bg-[#FFD643] text-black"
                          : "text-gray-600"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                    {slot.available && slot.spotsLeft > 0 ? (
                      <span className="text-red-500 text-xs ml-1">{slot.spotsLeft} left</span>
                    ) : (
                      <span className="text-xs ml-1">Sold out</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">No slots available for this date</p>
            )}

            <p className="text-[11px] text-gray-400 mb-6">All times are in IST (GMT +5:30)</p>

            <div className="mt-6">
              <h3 className="text-base font-semibold mb-2">About</h3>
              <div className="rounded-xl bg-gray-50 text-sm text-[#838383] p-3">
                {experience.about}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-6 h-[303px] w-[387px]">
            <div className="rounded-2xl shadow-sm  bg-white">
              {typeof experience.price === 'number' && (
                <div className=" flex justify-between">
                  <div className="text-sm text-[#656565] ">Starts at</div>
                  <div className="text-xl font-semibold">₹{experience.price}</div>
                </div>
              )}

              <div className="flex items-center justify-between py-2 ">
                <span className="text-sm text-[#656565]">Quantity</span>
                <div className="flex items-center gap-2 px-2 py-1">
                  <button aria-label="decrement" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-4 h-4 flex items-center justify-center place-items-center border">-</button>
                  <span className="min-w-4 text-center text-sm">{qty}</span>
                  <button aria-label="increment" onClick={() => setQty((q) => q + 1)} className="w-4 h-4 flex items-center justify-center place-items-center border">+</button>
                </div>
              </div>

              {(() => {
                const price = typeof experience.price === 'number' ? experience.price : 0;
                const subtotal = price * qty;
                const taxes = Math.round(subtotal * 0.059);
                const total = subtotal + taxes;
                return (
                  <div className="text-sm">
                    <div className="flex justify-between py-2 "><span className="text-[#656565]">Subtotal</span><span>₹{subtotal}</span></div>
                    <div className="flex justify-between py-2"><span className="text-[#656565]">Taxes</span><span>₹{taxes}</span></div>
                    <div className="flex justify-between py-3 font-semibold"><span>Total</span><span>₹{total}</span></div>
                  </div>
                );
              })()}

              <button
                disabled={!selectedSlot}
                onClick={() => {
                  if (!selectedSlot || !selectedDate || !experience) return;
                  const slotObj = groupedSlots[selectedDate]?.find(s => s.id === selectedSlot);
                  if (!slotObj) return;
                  const unitPrice = typeof experience.price === 'number' ? experience.price : 0;
                  const subtotal = unitPrice * qty;
                  const taxes = Math.round(subtotal * 0.059);
                  const total = subtotal + taxes;
                  navigate('/checkout', {
                    state: {
                      experienceId: id,
                      slotId: selectedSlot,
                      experience,
                      slot: { date: selectedDate, time: slotObj.time, id: selectedSlot },
                      quantity: qty,
                      subtotal,
                      taxes,
                      total,
                    },
                  });
                }}
                className={`mt-3 w-full py-3 rounded-xl text-base font-semibold ${
                  selectedSlot ? 'bg-[#FFD643] text-black  transition' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedSlot ? 'Confirm' : 'Select a time slot'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
