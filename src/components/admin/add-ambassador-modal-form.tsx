"use client";
import { useEffect, useMemo, useCallback } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAmbassadorStore } from "@/lib/store/ambassador-store";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email"),
  account_number: z.string().min(10, "Account number is required"),
  bank_code: z.string().min(1, "Bank is required"),
  account_name: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddModalForm({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    inviteUser,
    banks,
    verifyAccount,
    accountName,
    getBanks,
    selectBank,
    selectedBank,
    getAmbassadors,
    set,
    isBankLoading,
  } = useAmbassadorStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      account_number: "",
      bank_code: "",
      account_name: "",
    },
    mode: "onChange",
  });

  // Watch bankCode and accountNumber for auto-verification
  // const bankCode = watch("bank_code");
  // const accountNumber = watch("account_number");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        await getBanks();
      } catch (error) {
        console.error("Error fetching ambassadors:", error);
      }
    };

    fetchBanks();
  }, [getBanks]);

  // In your component
  const handleAccountVerification = useCallback(async () => {
    if (selectedBank?.code && watch("account_number")) {
      try {
        await verifyAccount(selectedBank.code, watch("account_number"));
      } catch (error) {
        console.error(error);
        // Optional: Additional error handling if needed
        setValue("account_number", "");
      }
    }
  }, [selectedBank, verifyAccount, watch, setValue]);

  // Use this effect to trigger verification
  useEffect(() => {
    if (selectedBank?.code && watch("account_number")?.length === 10) {
      handleAccountVerification();
    }
  }, [selectedBank, handleAccountVerification, watch]);

  useEffect(() => {
    setValue("account_name", accountName, { shouldValidate: true });
  }, [accountName, setValue]);

  const handleReset = () => {
    reset();

    set({
      accountName: "",
      selectedBank: null,
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await inviteUser(
        data.phoneNumber,
        data.email,
        data.firstName,
        data.lastName,
        data.account_number,
        data.account_name as string,
        data.bank_code
      );

      await getAmbassadors();
      handleReset();
    } catch (error) {
      console.error(error);
    }
  };

  // Filter unique banks
  const uniqueBanks = useMemo(() => {
    return banks?.length
      ? banks.filter(
          (bank, index, self) =>
            index === self.findIndex((b) => b.code === bank.code)
        )
      : [];
  }, [banks]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-[#080821] text-white border lg:max-w-4xl border-none text-sm rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Add User</DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">
          Edit user details and preferences here.
        </DialogDescription>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-y-10 lg:grid-cols-5"
        >
          <div className="col-span-2">
            <h1 className="font-semibold">Add User</h1>
            <p className="text-sm mt-1.5">Add Ambassador.</p>

            <Button
              disabled={
                isSubmitting ||
                !accountName ||
                !watch("bank_code") ||
                !watch("account_number")
              }
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
              <Label htmlFor="email">Email address</Label>

              <Input
                id="email"
                {...register("email")}
                placeholder="Email Address"
                className="text-white"
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
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                type="text"
                id="account_number"
                {...register("account_number")}
                placeholder="Account number"
                className="bg-transparent border-[#454545]"
              />
              {errors.account_number && (
                <p className="text-destructive text-sm mt-1.5">
                  {errors.account_number.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Bank</Label>
              <Select
                value={selectedBank?.code ?? ""}
                onValueChange={(code) => {
                  const bank = uniqueBanks.find((b) => b.code === code);
                  if (bank) {
                    selectBank(bank);
                  }
                  setValue("bank_code", bank?.code || "");
                }}
              >
                <SelectTrigger className="w-full !h-14">
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {isBankLoading ? (
                    <SelectItem disabled value={"loading"}>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin cursor-not-allowed" />
                    </SelectItem>
                  ) : (
                    uniqueBanks?.map((bank) => (
                      <SelectItem
                        key={`${bank.code}-${bank.name}`}
                        value={bank.code}
                      >
                        {bank.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.bank_code && (
                <p className="text-red-500">{errors.bank_code.message}</p>
              )}
            </div>

            {accountName && (
              <div className="text-[#0F973D] text-xs bg-[#E7F6EC] p-2 rounded-[12px]">
                {accountName}
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
