import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated, getUser, logoutUser, UserType } from "@/utils/auth";
import { getRedirectPath } from "@/utils/routeGuard";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        const user = getUser();
        if (user) {
          setUserType(user.userType);
        }
      }
    };
    
    checkAuth();
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleLogout = async () => {
    const result = await logoutUser();
    
    if (result.success) {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setIsLoggedIn(false);
      setUserType(null);
      navigate("/");
    } else {
      toast({
        title: "Logout failed",
        description: result.message || "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  const getDashboardLink = () => {
    if (!userType) return "/";
    
    switch(userType) {
      case "donor": return "/donor-dashboard";
      case "ngo": return "/ngo-dashboard";
      case "recipient": return "/recipient-dashboard";
      case "admin": return "/admin-dashboard";
      default: return "/";
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glassmorphism py-3" : "bg-medishare-dark py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/45a81f67-90b3-43d3-9499-2a874a4d48be.png" 
              alt="MediShare Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" isScrolled={isScrolled} />
            <NavLink href="/recipients" label="Recipients" isScrolled={isScrolled} />
            <NavLink href="/ngos" label="NGOs" isScrolled={isScrolled} />
            <NavLink href="/donors" label="Donors" isScrolled={isScrolled} />
            
            {isLoggedIn ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`${isScrolled ? "text-medishare-blue" : "text-white"} flex items-center gap-2 hover:bg-opacity-20`}
                    >
                      <UserCircle className="h-5 w-5" />
                      <span>Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/sign-in">
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-medishare-orange hover:bg-medishare-gold text-white"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white rounded-md p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? "text-medishare-dark" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? "text-medishare-dark" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pt-4 pb-3 animate-fade-in-up">
            <div className="flex flex-col space-y-4">
              <MobileNavLink href="/" label="Home" onClick={toggleMenu} />
              <MobileNavLink href="/recipients" label="Recipients" onClick={toggleMenu} />
              <MobileNavLink href="/ngos" label="NGOs" onClick={toggleMenu} />
              <MobileNavLink href="/donors" label="Donors" onClick={toggleMenu} />
              
              {isLoggedIn ? (
                <>
                  <MobileNavLink href={getDashboardLink()} label="Dashboard" onClick={toggleMenu} />
                  <MobileNavLink href="/profile" label="Profile" onClick={toggleMenu} />
                  <div 
                    className="text-white hover:text-medishare-gold font-medium transition duration-300 px-4 py-2 flex items-center space-x-2 cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </>
              ) : (
                <MobileNavLink href="/sign-in" label="Sign In" onClick={toggleMenu} />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ href, label, isScrolled }: { href: string; label: string; isScrolled: boolean }) => (
  <Link
    to={href}
    className={`font-medium transition duration-300 ${
      isScrolled
        ? "text-medishare-blue hover:text-medishare-orange"
        : "text-white hover:text-medishare-gold"
    } ${
      window.location.pathname === href ? "font-bold" : ""
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ href, label, onClick }: { href: string; label: string; onClick: () => void }) => (
  <Link
    to={href}
    className="text-white hover:text-medishare-gold font-medium transition duration-300 block px-4"
    onClick={onClick}
  >
    {label}
  </Link>
);

export default Navbar;
