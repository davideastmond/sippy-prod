import { ButtonText } from "@/components/buttonText";
import { TextLabel } from "@/components/textLabel";
import { AdminService } from "@/services/admin-service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminTool() {
  const webRouter = useRouter();
  const { status } = useSession();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isBusy, setIsBusy] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsBusy(true);
      await AdminService.setAuthenticatedUserAsAdmin({
        username: formData.username,
        password: formData.password,
      });

      // If successful, set a status message with link to go back to dashboard
    } catch (error) {
      console.error(error);
      setIsSubmitError(true);
    } finally {
      setIsBusy(false);
      setIsSubmitted(true);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      webRouter.replace("/authenticate");
    }
  }, [status]);

  if (isSubmitted) {
    return SubmitStatusMessage(isSubmitError);
  }
  return (
    <div className="bg-slate-200 flex flex-col relative mb-4 md:ml-[30%] md:mr-[30%] mt-48 rounded-lg shadow-md">
      <div className="flex flex-col justify-center items-center flex-grow text-center px-4 md:px-16 mt-12 mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Admin
        </h1>
        <p className="text-gray-600 mb-2 md:mb-8 text-lg md:text-base text-justify">
          Enter the credentials provided by the system administrator. <br />
          Clicking send will send a request to upgrade your currently logged-in
          account to admin status.
        </p>

        <div className="flex flex-col w-full max-w-sm">
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-y-6">
            <div className="flex gap-x-2">
              <input
                placeholder="Username"
                type="text"
                value={formData.username}
                required
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                name="username"
                className="flex w-full h-12 py-2 px-4 font-lato text-lg placeholder:text-simmpy-gray-200 text-black relative"
              />
            </div>
            <div className="flex gap-x-2">
              <input
                placeholder="Password"
                type="password"
                value={formData.password}
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                name="password"
                className="flex w-full h-12 py-2 px-4 font-lato text-lg rounded-md placeholder:text-simmpy-gray-200 text-black relative"
              />
            </div>
            <div className="flex gap-x-2 mt-4">
              <ButtonText
                text="Send"
                color="Yellow"
                name="submit"
                disabled={isBusy}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const SubmitStatusMessage = (isError: boolean) => {
  const router = useRouter();

  if (!isError)
    return (
      <div className="flex p-6 flex-col gap-4 bg-simmpy-gray-600 rounded-md justify-center items-center lg:mx-[30%] mt-[200px]">
        <TextLabel
          text="Your request has been completed."
          fontSize="Text-20"
          color="Gray-100"
        />
        <ButtonText
          text="Return to dashboard"
          color="Green"
          onClick={() => router.push("/dashboard")}
        />
      </div>
    );

  return (
    <div className="flex p-6 flex-col gap-4 bg-simmpy-gray-600 rounded-md justify-center items-center lg:mx-[30%] mt-[200px]">
      <TextLabel
        text="Sorry, we can't complete your request. Please contact the system administrator."
        fontSize="Text-20"
        color="Yellow"
      />
    </div>
  );
};
