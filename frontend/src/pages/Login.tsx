import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Both username and password are required.");
      return;
    }

    const result = await login(username, password);
    if (!result.success) {
      setError(result.message ?? "Invalid credentials.");
      return;
    }

    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1 items-center text-center">
          <img
            src="/logo.png"
            alt="Mortality Surveillance System"
            className="mb-4 h-16 w-auto object-contain"
          />
          <CardTitle className="text-2xl font-bold tracking-tight">Mortality Surveillance System</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                data-testid="input-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                data-testid="input-password"
              />
            </div>
            
            {error && (
              <div className="text-sm font-medium text-destructive" data-testid="error-message">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full font-medium" data-testid="button-login">
              Log In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary underline" data-testid="link-register">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
