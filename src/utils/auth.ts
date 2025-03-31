/**
 * Authentication utilities for MediShare
 */
import { supabase } from '@/integrations/supabase/client';

// User type definitions
export type UserType = 'donor' | 'ngo' | 'recipient' | 'admin';

export interface UserData {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  verified: boolean;
  createdAt: string;
  // Additional fields based on user type
  organization?: string; 
  address?: string;
  phoneNumber?: string;
  verificationId?: string; // GST ID, UID, DigiLocker ID, or Admin code
  department?: string; // For admin users
  entity_id?: string; // Add entity_id property to fix TypeScript errors
}

// Local storage keys
const USER_KEY = 'medishare_user';
const AUTH_TOKEN_KEY = 'medishare_auth_token';

/**
 * Save user data to local storage
 */
export const saveUser = (userData: UserData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Get user data from local storage
 */
export const getUser = (): UserData | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Remove user data from local storage (logout)
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getUser();
};

/**
 * Logout the current user
 * @returns Object indicating success and optional message
 */
export const logoutUser = (): {success: boolean; message?: string} => {
  try {
    removeUser();
    return {
      success: true,
      message: "Successfully logged out"
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Error during logout"
    };
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string, 
  password: string, 
  userType: UserType
): Promise<{success: boolean; userData?: UserData; message?: string}> => {
  try {
    console.log(`Attempting to login user: ${email} as ${userType}`);
    
    // Map user type to entity_type in the database
    let entityType = '';
    if (userType === 'donor') {
      entityType = 'Donor';
    } else if (userType === 'ngo') {
      entityType = 'Intermediary NGO';
    } else if (userType === 'recipient') {
      entityType = 'Recipient';
    } else if (userType === 'admin') {
      entityType = 'Admin';
    }
    
    // Query the users table to find the user with matching email and entity_type
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', parseInt(password, 10))
      .eq('entity_type', entityType)
      .single();
    
    if (error || !data) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Invalid email or password."
      };
    }
    
    // Check if the user is verified
    if (data.verification !== 'Verified') {
      return {
        success: false,
        message: "Your account has not been verified by an admin yet or has been rejected. Please contact support for assistance."
      };
    }
    
    // Now get additional user details from the appropriate table
    let userProfile = null;
    let address = '';
    let organization = '';
    let phoneNumber = '';
    let name = '';
    
    if (userType === 'donor') {
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .select('*')
        .eq('entity_id', data.entity_id)
        .single();
        
      if (!donorError && donorData) {
        userProfile = donorData;
        address = userProfile.address || '';
        organization = userProfile.org_name || '';
        phoneNumber = userProfile.phone || '';
        name = userProfile.name || '';
      }
    } else if (userType === 'ngo') {
      const { data: ngoData, error: ngoError } = await supabase
        .from('intermediary_ngo')
        .select('*')
        .eq('entity_id', data.entity_id)
        .single();
        
      if (!ngoError && ngoData) {
        userProfile = ngoData;
        address = userProfile.address || '';
        organization = userProfile.name || '';
        phoneNumber = userProfile.phone || '';
        name = userProfile.name || '';
      }
    } else if (userType === 'recipient') {
      const { data: recipientData, error: recipientError } = await supabase
        .from('recipients')
        .select('*')
        .eq('entity_id', data.entity_id)
        .single();
        
      if (!recipientError && recipientData) {
        userProfile = recipientData;
        address = userProfile.address || '';
        organization = userProfile.org_name || '';
        phoneNumber = userProfile.phone || '';
        name = userProfile.name || '';
      }
    }
    
    // Create user data object
    const userData: UserData = {
      id: data.entity_id,
      email: data.email,
      name: name || email.split('@')[0],
      userType: userType,
      verified: data.verification === 'Verified',
      createdAt: data.created_at,
      organization: organization,
      address: address,
      phoneNumber: phoneNumber,
      verificationId: data.verification_id,
    };
    
    // Save user data
    saveUser(userData);
    
    return {
      success: true,
      userData
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during login."
    };
  }
};

/**
 * Register a new user
 */
export const registerUser = async (
  userData: Partial<UserData>,
  password: string,
  verificationId: string
): Promise<{success: boolean; message?: string}> => {
  try {
    console.log("Registering user:", userData);
    
    // Basic validation
    if (!userData.email || !userData.userType || !password || !verificationId) {
      return {
        success: false,
        message: "Missing required fields for registration."
      };
    }
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .single();
    
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists."
      };
    }
    
    // Generate entity ID for the new user
    const entityId = crypto.randomUUID();
    
    // Insert new user into the users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        password: parseInt(password, 10),
        entity_id: entityId,
        entity_type: userData.userType === 'donor' ? 'Donor' :
                     userData.userType === 'ngo' ? 'Intermediary NGO' :
                     userData.userType === 'recipient' ? 'Recipient' : 'Admin',
        verification_id: verificationId
      });
    
    if (insertError) {
      throw insertError;
    }
    
    // Insert user profile into the corresponding table based on user type
    if (userData.userType === 'donor') {
      const { error } = await supabase
        .from('donors')
        .insert({
          entity_id: entityId,
          name: userData.name || '',
          org_name: userData.organization || '',
          address: userData.address || '',
          phone: userData.phoneNumber || '',
          longitude: '0', // Default value, update with actual location later
          latitude: '0'  // Default value, update with actual location later
        });
      
      if (error) throw error;
    } 
    else if (userData.userType === 'ngo') {
      const { error } = await supabase
        .from('intermediary_ngo')
        .insert({
          entity_id: entityId,
          name: userData.organization || '',
          address: userData.address || '',
          phone: userData.phoneNumber || ''
        });
      
      if (error) throw error;
    } 
    else if (userData.userType === 'recipient') {
      const { error } = await supabase
        .from('recipients')
        .insert({
          entity_id: entityId,
          name: userData.name || '',
          org_name: userData.organization || '',
          address: userData.address || '',
          phone: userData.phoneNumber || ''
        });
      
      if (error) throw error;
    }
    
    return {
      success: true,
      message: "Registration successful! You can now sign in with your credentials."
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during registration."
    };
  }
};
