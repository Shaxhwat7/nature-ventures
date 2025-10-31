import { Link } from 'react-router-dom'
import type { Experience } from '@/lib/api'
interface ExperienceCardProps {
  experience: Experience
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
<Link to={`/experience/${experience.id}`}>
  <div className="w-[280px] h-[312px] bg-white rounded-xl overflow-hidden flex flex-col">
    <img
      src={`${import.meta.env.VITE_BACKEND_URL}${experience.image}`}
      alt=""
      className="w-full h-[170px] object-cover"
    />

    <div className="flex flex-col justify-between px-3 py-2 flex-1 overflow-hidden">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-[16px] font-semibold text-gray-900 truncate">
            {experience.title}
          </h2>
          <button className="text-[12px] text-[#161616] bg-[#D6D6D6] px-2 py-1 rounded-md ">
            {experience.location}
          </button>
        </div>

        <p className="text-[12px] text-gray-600 leading-snug line-clamp-3">
          {experience.description}
        </p>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-gray-500">From</span>
          <span className="text-[16px] font-semibold text-gray-900">
            {"\u20B9"}{experience.price}
          </span>
        </div>

        <button className="bg-[#FFD400] text-black text-[12px] font-medium px-3 py-1 rounded-md hover:bg-[#ffcc00] transition">
          View Details
        </button>
      </div>
    </div>
  </div>
</Link>

  )
}
