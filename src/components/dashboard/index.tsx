import React, { PropsWithChildren, useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { TfiClose } from "react-icons/tfi";
import { RiWechatLine } from "react-icons/ri";
import AddContact from "./AddContact";
import useRoomsBySenderName from "@/hooks/useRoomsBySenderName";
import useSenderById from "@/hooks/useSenderById";
import { useRouter } from "next/router";

const Dashboard = ({ children }: PropsWithChildren) => {
  const {
    push,
    query: { senderId, roomId },
  } = useRouter();
  const {
    data: senderInfo,
    error,
    isLoading,
  } = useSenderById(senderId?.toString());
  useEffect(() => {
    if (error) push("/");
  }, [error, push]);

  const { data: rooms, isLoading: isLoadingRooms } = useRoomsBySenderName(
    senderInfo?.data?.name
  );
  const [open, setOpen] = useState(!!roomId?.toString() ? false : true);
  const [openAddContact, setOpenAddContact] = useState(false);
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  if (!senderInfo?.data || isLoadingRooms || isLoading)
    return <div>Loading...</div>;
  return (
    <div className="w-full flex flex-col h-[calc(100dvh)] overflow-hidden">
      <nav className="h-14 flex justify-between px-2 items-center flex-shrink-0 flex-grow-0 bg-secondary/30">
        <div>
          <button className="btn btn-ghost" onClick={() => push("/")}>
            Home
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setOpenAddContact(true)}
          >
            Add Contact
          </button>
        </div>
        <label className="btn btn-square swap swap-rotate md:hidden">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" onChange={() => setOpen((prev) => !prev)} />

          {/* hamburger icon */}
          <RxHamburgerMenu className="h-8 w-8 swap-on " />

          {/* close icon */}
          <TfiClose className="h-8 w-8 swap-off " />
        </label>
      </nav>
      <div className="w-full flex flex-row grow overflow-hidden ">
        <div
          className={` w-full md:w-[300px] flex-shrink-0 flex-grow-0  flex flex-col md:border-r-[3px] border-neutral-600/20 border-r-0
            ${open ? "flex" : "hidden md:flex"}`}
        >
          {/* <h1 className="font-bold text-2xl text-center m-2">Chat Rooms</h1>
            <div className="divider m-0" /> */}
          <div className="w-full grow overflow-auto">
            <ul className="w-full max-w-full menu menu-vertical flex flex-col gap-1">
              {rooms?.data.map((room) => {
                return (
                  <li
                    key={room.id}
                    className={`border-[1px] ${
                      room.id === roomId?.toString()
                        ? "border-slate-300/20 bg-secondary/30"
                        : "border-slate-600/10"
                    } rounded-lg`}
                  >
                    <a
                      onClick={() => {
                        push(`/${senderInfo.data.id}/${room.id}`);
                        setOpen((prev) => !prev);
                      }}
                    >
                      <RiWechatLine className="w-6 h-6 text-primary" />
                      <span className="text-lg font-semibold">{room.name}</span>

                      {/* 
                      //TODO: show message count that sended after last seen
                      <span className="badge badge-sm badge-success">99+</span>
                       */}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="divider m-0" />
          <div className="p-2 gap-1">
            <h1 className="font-bold">Your Chat Id:</h1>
            <button
              className="btn tooltip text-left"
              data-tip="Copy to clipboard"
              onClick={() => handleCopy(senderInfo?.data?.name)}
            >
              {senderInfo?.data?.name}
            </button>
          </div>
        </div>
        <div
          className={` w-full
             ${open ? "hidden md:flex" : " flex"}`}
        >
          {children}
        </div>
      </div>
      <AddContact
        open={openAddContact}
        setOpen={setOpenAddContact}
        sender={senderInfo?.data}
        callBack={setOpen}
      />
    </div>
  );
};

export default Dashboard;
