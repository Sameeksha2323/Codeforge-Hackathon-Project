
/**
 * Route guard utility for MediShare
 * This file contains functions to manage route protection and page access
 */
import { UserType, isAuthenticated, getUser } from "./auth";

/**
 * Check if a user has access to a specific route
 * @param requiredUserType The user type required to access the route
 * @returns boolean indicating access permission
 */
export const hasRouteAccess = async (requiredUserType?: UserType | UserType[]): Promise<boolean> => {
  // If no specific user type is required, check if user is authenticated
  if (!requiredUserType) {
    return await isAuthenticated();
  }
  
  // Get current user
  const user = getUser();
  
  // If no user, deny access
  if (!user) {
    return false;
  }
  
  // Check if user type matches required type(s)
  if (Array.isArray(requiredUserType)) {
    return requiredUserType.includes(user.userType);
  }
  
  return user.userType === requiredUserType;
};

/**
 * Get the appropriate redirect path based on user type
 * @returns string Path to redirect to
 */
export const getRedirectPath = (): string => {
  const user = getUser();
  
  if (!user) {
    return "/sign-in";
  }
  
  switch(user.userType) {
    case "donor":
      return "/donor-dashboard";
    case "ngo":
      return "/ngo-dashboard";
    case "recipient":
      return "/recipient-dashboard";
    case "admin":
      return "/admin-dashboard";
    default:
      return "/";
  }
};

/**
 * Get navigation links based on user type
 * @returns Array of navigation links
 */
export const getUserNavLinks = () => {
  const user = getUser();
  
  if (!user) {
    return [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "NGOs", path: "/ngos" },
      { label: "Donors", path: "/donors" },
      { label: "Recipients", path: "/recipients" },
      { label: "Contact", path: "/contact" },
    ];
  }
  
  // Common links for all authenticated users
  const commonLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
  ];
  
  // User type specific links
  switch(user.userType) {
    case "donor":
      return [
        ...commonLinks,
        { label: "Dashboard", path: "/donor-dashboard" },
        { label: "NGOs", path: "/ngos" },
        { label: "Recipients", path: "/recipients" },
        { label: "Contact", path: "/contact" },
      ];
    case "ngo":
      return [
        ...commonLinks,
        { label: "Dashboard", path: "/ngo-dashboard" },
        { label: "Donors", path: "/donors" },
        { label: "Recipients", path: "/recipients" },
        { label: "Contact", path: "/contact" },
      ];
    case "recipient":
      return [
        ...commonLinks,
        { label: "Dashboard", path: "/recipient-dashboard" },
        { label: "Donors", path: "/donors" },
        { label: "NGOs", path: "/ngos" },
        { label: "Contact", path: "/contact" },
      ];
    case "admin":
      return [
        ...commonLinks,
        { label: "Dashboard", path: "/admin-dashboard" },
        { label: "Donors", path: "/donors" },
        { label: "NGOs", path: "/ngos" },
        { label: "Recipients", path: "/recipients" },
      ];
    default:
      return commonLinks;
  }
};
