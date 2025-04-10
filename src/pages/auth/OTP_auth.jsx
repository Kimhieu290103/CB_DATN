import { useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

const OTPAuth = () => {
const [value, setValue] = useState("")
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.length !== 6) {
        alert("OTP must be 6 characters long.");
        return;
    }
    console.log(value, typeof value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
        <form onSubmit={handleSubmit}>
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={value} onChange={(value) => setValue(value)}>
                <InputOTPGroup className="text-blue-50">
                    <InputOTPSlot index={0} className='h-16' />
                </InputOTPGroup>

                <InputOTPGroup className="text-blue-50">
                    <InputOTPSlot index={1} />
                </InputOTPGroup>

                <InputOTPGroup className="text-blue-50">
                    <InputOTPSlot index={2} />
                </InputOTPGroup>

                <InputOTPGroup className="text-blue-50">
                    <InputOTPSlot index={3} />
                </InputOTPGroup>

                <InputOTPGroup className="text-blue-50">
                    <InputOTPSlot index={4} />
                </InputOTPGroup>

                <InputOTPGroup className="text-blue-50">
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>

            <Button type="submit" className="mt-4">Submit</Button>
        </form>
    </div>
  );
};

export default OTPAuth;