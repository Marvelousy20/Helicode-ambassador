"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, isLoading, error, role, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);

      if (role === "admin") {
        router.push("/admin-dashboard");
      } else if (role === "ambassador") {
        router.push("/ambassador-dashboard");
      } else {
        router.push("/dashboard");
      }

      toast.success("Login successful");
    } catch (err) {
      console.error(err);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "admin") {
        router.push("/admin-dashboard");
      } else if (role === "ambassador") {
        router.push("/ambassador-dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, role, router]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 text-white"
    >
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...form.register("email")} />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password" className="text">
          Password
        </Label>

        <div className="relative">
          <Input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
          <span
            onClick={toggleVisibility}
            className=" absolute top-[18%] right-4"
          >
            {isPasswordVisible ? (
              <Eye color="#6D6D6D" className="cursor-pointer" />
            ) : (
              <EyeOff color="#6D6D6D" className="cursor-pointer" />
            )}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-10"
        disabled={!form.formState.isValid || isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Login
      </Button>
    </form>
  );
}
