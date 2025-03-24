"use client";
import { useEffect, useMemo } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Ambassador } from "@/lib/api/ambassador-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAmbassadorStore } from "@/lib/store/ambassador-store";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const paymentSchema = z.object({
  bank_code: z.string().min(1, "Bank is required"),
  account_number: z.string().min(10, "Account number is required"),
  account_name: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function AmbassadorPaymentInfoTab({
  ambassador,
  setIsOpenModal,
}: {
  ambassador: Ambassador;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    banks,
    accountName,
    isLoading,
    verifyAccount,
    getBanks,
    selectBank,
    selectedBank,
    updateAmbassador,
  } = useAmbassadorStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      bank_code: "",
      account_number: "",
      account_name: "",
    },
  });

  const bankCode = watch("bank_code");
  const accountNumber = watch("account_number");
  // const accountName = watch("account_name");

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

  // Auto fill account name when bak and account are filled

  useEffect(() => {
    if (bankCode && accountNumber.length === 10) {
      verifyAccount(bankCode, accountNumber);
    }
  }, [bankCode, accountNumber, verifyAccount]);

  useEffect(() => {
    setValue("account_name", accountName);
  }, [accountName, setValue]);

  const uniqueBanks = useMemo(() => {
    return banks?.filter(
      (bank, index, self) =>
        index === self.findIndex((b) => b.code === bank.code)
    );
  }, [banks]);

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      await updateAmbassador(ambassador.id, {
        accountNumber: data.account_number,
        bankCode: data.bank_code,
        accountName: data.account_name,
      });

      toast.success("Profile updated successfully");
      setIsOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="mt-10 lg:mt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-y-10 lg:grid-cols-5"
      >
        <div className="col-span-2">
          <h1 className="font-semibold">Payment Infomation</h1>
          <p className="text-sm mt-1.5">Update your payment details here.</p>

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
          <div className="space-y-1">
            <Label htmlFor="account_name">Full Name</Label>
            <Input
              type="text"
              id="account_name"
              {...register("account_name")}
              placeholder="Account name"
              className="bg-transparent border-[#454545]"
              disabled
            />
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
                {isLoading ? (
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
        </div>
      </form>
    </div>
  );
}
