import { useState } from "react";
import logo from "../assets/hd-logo.png";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
interface onSearchProps {
    onSearch?: (query: string) => void;
    isSearchEnabled?: boolean;
}

const NavBar = ({ onSearch, isSearchEnabled  }: onSearchProps) => {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    if ((isHome || isSearchEnabled) && onSearch) {
      onSearch(search);
    }
  };

  return (
    <nav className="w-full bg-[#F9F9F9] fixed top-0 left-0 z-10">
      <div className="max-w-[1440px] h-[87px] mx-auto flex justify-between items-center pt-4 pb-4 px-[124px] opacity-100">
        <Link to="/"> 
          <img src={logo} alt="Highway Delite" className="w-[100px] h-[55px]" />
        </Link>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search experiences"
            value={search}
            disabled={!isHome && !isSearchEnabled} 
            onChange={(e) => {
              setSearch(e.target.value);
              if (onSearch && isSearchEnabled) onSearch(e.target.value);
            }}
            className="pt-3 pr-4 pb-3 pl-4 opacity-100 bg-gray-100 text-sm text-[#727272] focus:outline-none h-[42px] w-[340px] rounded-lg"
          />
          <button
            type="submit"
            disabled={!isHome && !isSearchEnabled} 
            className="w-[87px] h-[42px] flex items-center justify-center pt-3 pr-5 pb-3 pl-5 rounded-xl opacity-100 bg-[#FFD54F] text-[#161616] font-medium"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default NavBar;
