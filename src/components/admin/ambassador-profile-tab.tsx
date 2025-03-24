"use client";
import { useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { z } from "zod";
import { useAmbassadorStore } from "@/lib/store/ambassador-store";
import { Ambassador } from "@/lib/api/ambassador-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const ambassadorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email({ message: "Invalid email" }),
  phoneNumber: z.string().min(10, "Phone number is required"),
  referralCode: z.string().min(1, "Referral code is required"),
});

type AmbassadorFormValues = z.infer<typeof ambassadorSchema>;

export function AmbassadorProfileTab({
  ambassador,
  setIsModalOpen,
}: {
  ambassador: Ambassador;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { updateAmbassador } = useAmbassadorStore();

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors, isSubmitting, isDirty },
  } = useForm<AmbassadorFormValues>({
    resolver: zodResolver(ambassadorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      referralCode: "",
    },
  });

  useEffect(() => {
    if (ambassador) {
      setValue("firstName", ambassador.firstName);
      setValue("lastName", ambassador.lastName);
      setValue("email", ambassador.email);
      setValue("phoneNumber", ambassador.phoneNumber);
      setValue("referralCode", ambassador.referralCode);
    }
  });

  const onSubmit = async (data: AmbassadorFormValues) => {
    try {
      await updateAmbassador(ambassador.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        referralCode: data.referralCode,
      });

      toast.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="mt-10 lg:mt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid lg:grid-cols-5 gap-y-10"
      >
        <div className="col-span-2">
          <h1 className="font-semibold">Personal Infomation</h1>
          <p className="text-sm mt-1.5">Update your personal details here.</p>

          <Button
            disabled={isSubmitting || !isDirty}
            className="text-sm font-semibold h-9 rounded-[8px] mt-5 w-[129px] flex justify-center items-center"
            type="submit"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
        <div className="col-span-3 space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className="bg-transparent border-[#454545]"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className="bg-transparent border-[#454545]"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              className="bg-transparent border-[#454545] disabled:cursor-not-allowed"
              disabled
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              className="bg-transparent border-[#454545]"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="referralCode">Referral Code</Label>
            <div className="relative">
              <Input
                id="referralCode"
                {...register("referralCode")}
                className="bg-transparent border-[#454545]"
              />
              <button
                type="button"
                className="border-[#8D58FF] border rounded-[12px] !text-xs p-1.5 absolute right-0 top-1/2 translate-y-[-50%] mr-4"
              >
                Generate another
              </button>
            </div>

            {errors.referralCode && (
              <p className="text-red-500 text-sm">
                {errors.referralCode.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
