import React, { FormEvent, useRef } from "react";
import Input from "../styled/Input";
import { addContact, updateSender } from "@/services/chatService";
import useSenderById from "@/hooks/useSenderById";
import useRoomsBySenderName from "@/hooks/useRoomsBySenderName";

const AddContact = ({
  open = false,
  setOpen,
  sender,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sender?: Sender;
}) => {
  const { data, mutate } = useSenderById(sender?.id);
  const { mutate: mutateRooms } = useRoomsBySenderName(sender?.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      inputRef.current &&
      data?.data?.contacts &&
      data?.data?.rooms &&
      data?.data?.name &&
      open
    ) {
      if (inputRef.current.value?.length < 3) return;
      try {
        await addContact(
          data.data?.id,
          [...data.data.contacts, inputRef.current.value],
          inputRef.current.value,
          data?.data?.rooms,
          data?.data?.name
        );
        await mutate();
        await mutateRooms();
        setOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  if (!data?.data || !open) return null;
  return (
    <>
      <dialog id="my_modal_3" open={open} className="modal">
        <section className="w-full min-w-[300px] modal-box">
          <form
            onSubmit={handleSubmit}
            method="dialog"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          >
            <h3 className="font-bold text-lg">Add Contact</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <div className=" form-control w-full gap-2">
              <Input
                label="Chat Id"
                type="text"
                placeholder="Enter Chat Id"
                ref={inputRef}
              />
              <button className="btn btn-primary" type="submit">
                Add
              </button>
            </div>
          </form>
        </section>
        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default" onClick={() => setOpen(false)}>
            close
          </button>
        </form>
      </dialog>
    </>
  );
};

export default AddContact;
