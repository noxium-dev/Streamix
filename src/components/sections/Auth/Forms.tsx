"use client";

import React, { useState } from "react";
import IconButton from "@/components/ui/button/IconButton";
import Brand from "@/components/ui/other/BrandLogo";
import { ArrowLeft } from "@/utils/icons";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import AuthForgotPasswordForm from "./ForgotPassword";
import AuthLoginForm from "./Login";
import AuthRegisterForm from "./Register";
import AuthResetPasswordForm from "./ResetPassword";

const ValidForms = ["login", "register", "forgot"] as const;
type ValidForm = (typeof ValidForms)[number];

export interface AuthFormProps {
  setForm: (form: ValidForm) => void;
}

const AuthForms: React.FC = () => {
  const { pathname } = useLocation();
  const reset = pathname === "/auth/reset-password";

  const [form, setFormState] = useState<ValidForm>("login");

  const setForm = (newForm: ValidForm) => {
    setFormState(newForm);
  };

  const formComponents: Record<ValidForm, React.ReactNode> = {
    login: <AuthLoginForm setForm={setForm} />,
    register: <AuthRegisterForm setForm={setForm} />,
    forgot: <AuthForgotPasswordForm setForm={setForm} />,
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-8 px-4">
      <div className="w-full max-w-sm">
        <Card
          shadow="sm"
          className="border border-divider bg-content1 w-full"
        >
          <CardHeader className="relative flex items-center justify-center pt-6 pb-2">
            {form === "forgot" && (
              <IconButton
                size="md"
                variant="light"
                onClick={() => setForm("login")}
                className="group absolute left-2 data-[hover=true]:bg-transparent"
                icon={<ArrowLeft className="text-2xl transition-transform group-hover:scale-110" />}
              />
            )}
            <Brand className="text-2xl md:text-3xl" animate />
          </CardHeader>

          <CardBody className="px-6 pb-6 pt-4 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={form}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {reset ? <AuthResetPasswordForm /> : formComponents[form]}
              </motion.div>
            </AnimatePresence>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AuthForms;
