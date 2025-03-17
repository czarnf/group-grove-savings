
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  // Check URL params for signup indicator
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setIsLogin(!searchParams.has("signup"));
  }, [location.search]);
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    navigate(isLogin ? "/auth?signup=true" : "/auth");
  };
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto">
        {isLogin ? (
          <LoginForm onToggle={toggleAuthMode} />
        ) : (
          <RegisterForm onToggle={toggleAuthMode} />
        )}
      </div>
    </div>
  );
}
