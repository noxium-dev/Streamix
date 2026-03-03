import { signIn } from "@/actions/auth";
import PasswordInput from "@/components/ui/input/PasswordInput";
import { LoginFormSchema } from "@/schemas/auth";
import { LockPassword, Mail } from "@/utils/icons";
import { addToast, Button, Input, Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { AuthFormProps } from "./Forms";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/app/providers";
import { Icon } from "@iconify/react";

const AuthLoginForm: React.FC<AuthFormProps> = ({ setForm }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { success, message } = await signIn(data);
    addToast({
      title: message,
      color: success ? "success" : "danger",
    });
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["supabase-user"] });
      return navigate("/");
    }
  });

  const getButtonText = useCallback(() => {
    if (isSubmitting) return "Signing In...";
    return "Sign In";
  }, [isSubmitting]);

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <p className="text-small text-foreground-500 mb-2 text-center">
          Sign in to continue your streaming journey
        </p>
        <Input
          {...register("email")}
          isInvalid={!!errors.email?.message}
          errorMessage={errors.email?.message}
          isRequired
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          variant="underlined"
          startContent={<Mail className="text-xl" />}
          isDisabled={isSubmitting}
        />
        <PasswordInput
          {...register("password")}
          isInvalid={!!errors.password?.message}
          errorMessage={errors.password?.message}
          isRequired
          variant="underlined"
          label="Password"
          placeholder="Enter your password"
          startContent={<LockPassword className="text-xl" />}
          isDisabled={isSubmitting}
        />
        <div className="flex justify-end -mt-1">
          <Link
            size="sm"
            className="cursor-pointer text-xs"
            onClick={() => setForm("forgot")}
            isDisabled={isSubmitting}
          >
            Forgot password?
          </Link>
        </div>
        <Button
          className="mt-2"
          color="primary"
          type="submit"
          variant="shadow"
          isLoading={isSubmitting}
          startContent={!isSubmitting && <Icon icon="lucide:log-in" className="text-lg" />}
        >
          {getButtonText()}
        </Button>
      </form>
      <p className="text-small text-center">
        Don&apos;t have an account?{" "}
        <Link
          isBlock
          size="sm"
          className="cursor-pointer"
          onClick={() => setForm("register")}
          isDisabled={isSubmitting}
        >
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default AuthLoginForm;
