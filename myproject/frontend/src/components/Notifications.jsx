import React, { useEffect } from "react";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X
} from "lucide-react";

function Notification({

    show,
    type = "success",
    message,
    onClose

}) {

    useEffect(() => {

        if (!show) return;

        const timer = setTimeout(() => {

            onClose();

        }, 2000);

        return () => clearTimeout(timer);

    }, [show, onClose]);

    if (!show) return null;

    const styles = {

        success: {

            icon: <CheckCircle size={22} className="text-green-700" />,
            bg: "bg-green-100",
            text: "text-green-900"

        },

        error: {

            icon: <XCircle size={22} className="text-red-700" />,
            bg: "bg-red-100",
            text: "text-red-900"

        },

        warning: {

            icon: <AlertTriangle size={22} className="text-yellow-700" />,
            bg: "bg-yellow-100",
            text: "text-yellow-900"

        },

        info: {

            icon: <Info size={22} className="text-blue-700" />,
            bg: "bg-blue-100",
            text: "text-blue-900"

        }

    };

    return (

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate__animated animate__bounceInUp">

            <div
                className={`flex items-center gap-3 min-w-[320px] max-w-[550px] px-5 py-4 rounded-xl shadow-xl border border-gray-200 ${styles[type].bg} ${styles[type].text} animate-fade-in`}
            >

                {styles[type].icon}

                <span className="flex-1 font-medium">

                    {message}

                </span>

                <button
                    onClick={onClose}
                    className="hover:opacity-70 transition"
                >

                    <X size={18} />

                </button>

            </div>

        </div>

    );

}

export default Notification;