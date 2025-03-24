import LoginForm from "@/components/login-form";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <div className="mx-auto w-full max-w-md space-y-6 p-6 shadow-lg rounded-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
