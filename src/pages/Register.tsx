import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { verifyGSTID, verifyUID, verifyDigiLocker, verifyAdminCode } from "@/utils/verificationApis";
import { registerUser, isAuthenticated, UserType } from "@/utils/auth";
import UserTypeSelector from "@/components/registration/UserTypeSelector";
import RegistrationSuccess from "@/components/registration/RegistrationSuccess";
import DonorRegistrationForm from "@/components/registration/DonorRegistrationForm";
import NGORegistrationForm from "@/components/registration/NGORegistrationForm";
import RecipientRegistrationForm from "@/components/registration/RecipientRegistrationForm";
import AdminRegistrationForm from "@/components/registration/AdminRegistrationForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  donorFormSchema, 
  ngoFormSchema, 
  recipientFormSchema, 
  adminFormSchema 
} from "@/components/registration/schemas";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      
      if (isAuth) {
        const user = JSON.parse(localStorage.getItem('medishare_user') || '{}');
        
        if (user.userType) {
          switch(user.userType) {
            case "donor":
              navigate("/donor-dashboard");
              break;
            case "ngo":
              navigate("/ngo-dashboard");
              break;
            case "recipient":
              navigate("/recipient-dashboard");
              break;
            case "admin":
              navigate("/admin-dashboard");
              break;
            default:
              navigate("/");
          }
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const donorForm = useForm({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      organizationName: "",
      email: "",
      password: "",
      gstId: "",
      phoneNumber: "",
      address: "",
      termsAccepted: false,
    },
  });

  const ngoForm = useForm({
    resolver: zodResolver(ngoFormSchema),
    defaultValues: {
      organizationName: "",
      email: "",
      password: "",
      uid: "",
      phoneNumber: "",
      address: "",
      termsAccepted: false,
    },
  });

  const recipientForm = useForm({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      digilocker: "",
      phoneNumber: "",
      address: "",
      termsAccepted: false,
    },
  });

  const adminForm = useForm({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      adminCode: "",
      phoneNumber: "",
      department: "",
      termsAccepted: false,
    },
  });

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
  };

  const nextStep = () => {
    if (step === 1 && userType) {
      setStep(2);
    }
  };

  const previousStep = () => {
    if (step === 2) {
      setStep(1);
      setFormError(null);
    }
  };

  const onSubmit = async (data) => {
    setFormError(null);
    setIsVerifying(true);
    
    try {
      let verificationResult;
      let verificationId = "";
      
      switch (userType) {
        case "donor":
          verificationId = data.gstId;
          verificationResult = await verifyGSTID(data.gstId);
          break;
        case "ngo":
          verificationId = data.uid;
          verificationResult = await verifyUID(data.uid);
          break;
        case "recipient":
          verificationId = data.digilocker;
          verificationResult = await verifyDigiLocker(data.digilocker);
          break;
        case "admin":
          verificationId = data.adminCode;
          verificationResult = await verifyAdminCode(data.adminCode);
          break;
        default:
          throw new Error("Invalid user type");
      }
      
      setIsVerifying(false);
      
      if (!verificationResult.valid) {
        setFormError(verificationResult.message || "Could not verify your credentials. Please check and try again.");
        toast({
          title: "Verification Failed",
          description: verificationResult.message || "Could not verify your credentials. Please check and try again.",
          variant: "destructive",
        });
        return;
      }
      
      setIsRegistering(true);
      
      const userData = {
        email: data.email,
        userType: userType,
        name: data.fullName || data.organizationName,
        organization: data.organizationName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        department: data.department,
      };
      
      const registrationResult = await registerUser(userData, data.password, verificationId);
      
      setIsRegistering(false);
      
      if (registrationResult.success) {
        setRegisteredEmail(data.email);
        
        toast({
          title: "Registration successful!",
          description: registrationResult.message || "Your account has been created.",
        });
        
        setRegistrationComplete(true);
      } else {
        setFormError(registrationResult.message || "An error occurred during registration.");
        toast({
          title: "Registration Failed",
          description: registrationResult.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsVerifying(false);
      setIsRegistering(false);
      console.error("Registration error:", error);
      setFormError("An unexpected error occurred. Please try again.");
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getActiveForm = () => {
    switch (userType) {
      case "donor":
        return {
          form: donorForm,
          onSubmit: donorForm.handleSubmit(onSubmit),
          render: () => (
            <DonorRegistrationForm form={donorForm} isVerifying={isVerifying} isRegistering={isRegistering} />
          ),
        };
      case "ngo":
        return {
          form: ngoForm,
          onSubmit: ngoForm.handleSubmit(onSubmit),
          render: () => (
            <NGORegistrationForm form={ngoForm} isVerifying={isVerifying} isRegistering={isRegistering} />
          ),
        };
      case "recipient":
        return {
          form: recipientForm,
          onSubmit: recipientForm.handleSubmit(onSubmit),
          render: () => (
            <RecipientRegistrationForm form={recipientForm} isVerifying={isVerifying} isRegistering={isRegistering} />
          ),
        };
      case "admin":
        return {
          form: adminForm,
          onSubmit: adminForm.handleSubmit(onSubmit),
          render: () => (
            <AdminRegistrationForm form={adminForm} isVerifying={isVerifying} isRegistering={isRegistering} />
          ),
        };
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-medishare-dark mb-4">Join MediShare</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create an account to start donating medicines, distributing to those in need, 
              or receiving medication assistance.
            </p>
          </div>

          {registrationComplete ? (
            <RegistrationSuccess 
              userType={userType} 
              email={registeredEmail || undefined}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                {formError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                
                {step === 1 && (
                  <UserTypeSelector 
                    selectedType={userType} 
                    onSelectType={handleUserTypeSelection} 
                  />
                )}

                {step === 2 && userType && getActiveForm()?.render()}

                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                  {step === 2 && (
                    <Button
                      variant="outline"
                      onClick={previousStep}
                      disabled={isVerifying || isRegistering}
                    >
                      Back
                    </Button>
                  )}
                  
                  {step === 1 ? (
                    <Button
                      className="ml-auto"
                      onClick={nextStep}
                      disabled={!userType}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      className="ml-auto"
                      type="submit"
                      onClick={getActiveForm()?.onSubmit}
                      disabled={isVerifying || isRegistering}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : isRegistering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          Register
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-gray-600">
            <p>
              Already have an account?{" "}
              <Link to="/sign-in" className="text-medishare-orange font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
