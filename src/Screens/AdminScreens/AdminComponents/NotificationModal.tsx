import React from 'react'
import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

interface NotificationModalProps{
    isOpen: boolean;
    onClose: () => void;
    heading:string;
    body:string;
    type:string;
    ActionFunction?: ()=>void;
}

const NotificationModal:React.FC<NotificationModalProps> = ({isOpen,onClose,heading,body,type,ActionFunction}) => {
  return (
    <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md rounded-xl text-black p-6 backdrop-blur-2xl bg-white">
                  <DialogTitle as="h3" className="text-base/7 font-medium ">
                    {heading}
                  </DialogTitle>
                  <p className="mt-2 text-sm/6 ">
                    {body}
                  </p>
                  <div className="mt-4">
                    {
                      type !== "none"&&(
                        <Button
                        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold  shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                        onClick={ActionFunction}
                      >
                        {type}
                      </Button>
                      )
                    }


                    <Button
                      className="ml-2 inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 text-white data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={onClose}
                    >
                      close
                    </Button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
    </Transition>
  )
}

export default NotificationModal
