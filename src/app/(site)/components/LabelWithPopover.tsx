"use client";

import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";

interface LabelWithPopoverProps {
    label: string;
    description: string;
}

export default function LabelWithPopover({
                                             label,
                                             description,
                                         }: LabelWithPopoverProps) {
    return (
        <div className="flex items-center mb-1">
            <span className="font-medium text-gray-700 mr-2">{label}</span>
            <Popover className="relative">
                <Popover.Button
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                    title="Show info"
                >
                    ?
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition duration-200 ease-out"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition duration-150 ease-in"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel
                        className="absolute z-10 mt-2 left-1/2 -translate-x-1/2 w-72 bg-white border border-gray-200 shadow-lg rounded p-4"
                        static
                    >
                        <div className="absolute top-0 left-1/2 w-3 h-3 -mt-2 -translate-x-1/2 rotate-45 bg-white border-l border-t border-gray-200" />
                        <p className="text-sm text-gray-700">{description}</p>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </div>
    );
}