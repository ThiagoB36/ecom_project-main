"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
import React from "react";
import { useFormik } from "formik";
import Link from "next/link";
import * as yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AuthFormContainer from "@/app/components/AuthFormContainer";
import { filterFormikErrors } from "@/app/utils/formikHelpers";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignIn() {
  //---------------- fix Bug
  const [sttTeste, setTeste] = React.useState("");
  const [sttValues, setValues] = React.useState({});
  console.log({ sttTeste });
  //---------------- fix Bug
  const router = useRouter();
  const {
    values,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, actions) => {
      const signInRes = await signIn("credentials", {
        ...values,
        redirect: false,
      });
      //---------------- fix Bug
      setValues(values);
      teste(values);
      //---------------- fix Bug

      if (signInRes?.error) {
        toast.error("Email/Password mismatch!");
      }
      if (!signInRes?.error) {
        router.refresh();
      }
    },
  });

  //---------------- fix Bug

  async function teste(values: any) {
    const response = await fetch("/api/teste", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const newCall = await response.json();
    console.log({ newCall });
    setTeste(newCall);
  }

  if (sttTeste !== "") {
    if (!sttTeste.emailVerified) {
      setTimeout(() => {
        console.log("falso setTime", sttTeste);
        teste(sttValues);
      }, 1000);
    } else {
      setTimeout(() => {
        console.log("verdadeiro setTime", sttTeste);
        // handleSubmit();
      }, 1000);
    }
  }
  //---------------- fix Bug

  const errorsToRender = filterFormikErrors(errors, touched, values);

  type valueKeys = keyof typeof values;

  const { email, password } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Login" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
        crossOrigin={undefined}
      />
      <Input
        name="password"
        label="Password"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password")}
        type="password"
        crossOrigin={undefined}
      />

      <Button
        type="submit"
        className="w-full"
        color="blue"
        disabled={isSubmitting}
      >
        Sign in
      </Button>

      <Button disabled={isSubmitting} type="submit" className="w-full">
        <FcGoogle size={22} className="inline mr-2" />
        Continue with Google
      </Button>

      <div className="flex items-center justify-between">
        <Link href="/auth/signup">Sign up</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>
      <div className="">
        {errorsToRender.map((item) => {
          return (
            <div
              key={item}
              className="space-x-1 flex items-center text-red-500"
            >
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{item}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
