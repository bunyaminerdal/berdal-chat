"use client";
import React, { FormEvent, MutableRefObject, useRef, useState } from "react";
import Input from "./styled/Input";
import { v4 as uuidv4 } from "uuid";
import { createSender } from "@/services/chatService";
import { useRouter } from "next/router";

const Login = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      if (inputRef.current.value?.length < 3) return;
      setLoading(true);
      try {
        const sender = await createSender(inputRef.current.value);
        if (sender) push(`/${sender.id}`);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col items-center p-5 max-w-md">
        <header>
          <h1 className="font-bold text-3xl">Login</h1>
        </header>
        <section className="w-full min-w-[300px]">
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full gap-2">
              <Input
                label="Chat Id"
                type="text"
                placeholder="Enter Chat Id"
                ref={inputRef}
                minLength={3}
              />
              <div className="justify-end">
                <button
                  className={`btn btn-primary ${
                    loading ? "btn-disabled btn-outline" : ""
                  }`}
                  type="submit"
                >
                  login
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
