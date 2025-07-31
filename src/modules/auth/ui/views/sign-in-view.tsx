"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlert, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

// Enhanced form schema with better validation
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL:"/",
      });
    } catch (err: any) {
      if (err.code === "invalid_email") {
        setError("Invalid email address. Please check and try again.");
      } else if (err.code === "invalid_password") {
        setError("Invalid password. Please check and try again.");
      } else {
        setError(err.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const onSocial = async (provider:"github"|"google") => {
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider: provider,
        callbackURL:"/",
      });
    } catch (err: any) {
      if (err.code === "invalid_email") {
        setError("Invalid email address. Please check and try again.");
      } else if (err.code === "invalid_password") {
        setError("Invalid password. Please ensure it meets the requirements.");
      } else if (err.code === "email_already_exists") {
        setError("This email is already registered. Please use a different email.");
      } else {
        setError(err.message || "Failed to sign up. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-4 p-4">
      <div className="flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Left Side - Login Form */}
        <div className="flex-1 p-4 lg:p-6 bg-background order-2 lg:order-1">
          <Card className="border-0 shadow-none">
            <CardHeader className="space-y-1 px-0">
              <CardTitle className="text-xl lg:text-2xl font-bold">
                Sign in to your account
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {!!error && (
                <Alert variant="destructive" className="mb-6">
                  <OctagonAlert className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              disabled={isLoading}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 font-normal text-sm"
                      onClick={() => {
                        console.log("Forgot password clicked");
                      }}
                    >
                      Forgot your password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => onSocial("google")}
                      className="w-full"
                    >
                    
                      <FcGoogle className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => onSocial("github")}
                      className="w-full"
                    >
                        <FaGithub className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    asChild
                    variant="link"
                    className="px-0 font-normal"
                  >
                    <a href="/sign-up">
                      Sign up
                    </a>
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Meet.AI Branding */}
        <div className="flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 lg:p-6 order-1 lg:order-2">
          <div className="text-center text-white space-y-4">
            <div className="flex justify-center mt-2 lg:mt-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl overflow-hidden bg-transparent flex items-center justify-center shadow-2xl scale-125 lg:scale-150">
                <Image src="/logo.svg" alt="Meet.AI" width={64} height={64} />
              </div>
            </div>
            <div className="space-y-2 lg:space-y-4">
              <h1 className="text-2xl lg:text-3xl font-bold">
                Meet.AI
              </h1>
            </div>

            <div className="space-y-3 lg:space-y-4 max-w-sm mx-auto">
              <p className="text-base lg:text-lg font-medium opacity-90">
                Where Intelligence Meets Innovation
              </p>
              <p className="text-xs lg:text-sm opacity-75 leading-relaxed">
                Connect with the future of artificial intelligence. 
                Streamline your workflow and unlock new possibilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Section */}
      <div className="mt-4 lg:mt-6 text-center px-2 lg:px-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          By signing in, you agree to our{" "}
          <Button
            variant="link"
            className="px-0 text-xs font-normal underline text-primary hover:text-primary/80"
            onClick={() => {
              console.log("Terms of Service clicked");
            }}
          >
            Terms of Service
          </Button>
          {" "}and{" "}
          <Button
            variant="link"
            className="px-0 text-xs font-normal underline text-primary hover:text-primary/80"
            onClick={() => {
              console.log("Privacy Policy clicked");
            }}
          >
            Privacy Policy
          </Button>
          . We use cookies and similar technologies to enhance your experience on our platform.
        </p>
      </div>
    </div>
  );
};