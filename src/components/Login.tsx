"use client";
import { createSender } from "@/services/chatService";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import Input from "./styled/Input";

const Login = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
        setError(true);
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
              <div className="justify-end flex w-full">
                <button
                  className={`btn btn-primary ${
                    loading ? "btn-disabled btn-outline" : ""
                  }`}
                  disabled={error}
                  type="submit"
                >
                  Login
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    null
                  )}
                </button>
              </div>
              <div>
                {error && (
                  <div className="alert alert-error shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                      <span>{'Server connection has denied! Pls try later!'}</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
