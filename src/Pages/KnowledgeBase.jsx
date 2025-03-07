
import React, { useContext, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Header from "../Components/Header";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Components/Sidebar";

const KnowledgeBase = () => {
    const { user } = useContext(AuthContext);
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "Why isn’t my printer working?",
            answer: "Check if the printer is powered on and connected to the correct network or directly to your computer. Ensure there’s enough paper and ink or toner in the printer. Try restarting the printer and your computer. If the printer is still not responding, check if it’s set as the default printer on your computer and that there are no pending print jobs stuck in the queue. If all else fails, try reinstalling the printer drivers.",
        },
        {
            question: "My email isn’t syncing or sending. What should I do?",
            answer: "Start by checking your internet connection. If it's stable, try closing and reopening your email client or refreshing the inbox. Make sure your email settings (server, port, username, and password) are correct. If you're using an Outlook client, try clearing its cache or repairing the account. If the issue continues, check if there are any server outages or updates required for your email client.",
        },
        {
            question: "Why does my application crash frequently?",
            answer: "This could be due to outdated software, insufficient system resources, or a conflict with other software. Try updating the application to the latest version. Also, check your computer’s hardware resources (e.g., RAM and CPU usage) to ensure they’re not being maxed out. If the issue persists, reinstall the application, as it may have become corrupted.",
        },
        {
            question: "How do I remove pop-up ads or malware?",
            answer: "Run a complete antivirus or antimalware scan on your system. If you don’t have antivirus software installed, consider downloading reputable free software like Malwarebytes or Avast. Clear your browser’s cache and cookies. If the issue persists, contact IT support to ensure all malware is removed and that your computer is secure.",
        },
        {
            question: "Why can't I access a shared network drive?",
            answer: "Ensure that your computer is connected to the correct network and that you have the necessary permissions to access the shared drive. Try restarting both your computer and the server. If the issue persists, check if the shared drive is down or if there are any ongoing network issues.",
        },
        {
            question: "What should I do if an application is not responding?",
            answer: "Try closing the application by using Task Manager (Windows) or Force Quit (Mac). If it doesn't close, restart your computer. Make sure the application is up to date, as outdated versions can cause instability. If the issue continues, reinstall the application to resolve any corrupted files.",
        },
        {
            question: "Why is a website blocked by the firewall?",
            answer: "Check if the website is being blocked by your organization’s firewall. Try accessing the website from a different network (e.g., using mobile data). If you’re working from an office network, contact IT support to see if the website is intentionally blocked for security reasons.",
        },
        {
            question: "Why am I getting a 'file access denied' error?",
            answer: "This typically happens when you don’t have the necessary permissions to access a file or folder. Try adjusting the permissions under Properties > Security (Windows) or Get Info > Sharing & Permissions (Mac). If you are unable to change these settings, contact your system administrator.",
        },
        {
            question: "Why is my internet connection slow?",
            answer: "Check if multiple devices are consuming bandwidth. Restart your router and modem. If using Wi-Fi, try moving closer to the router. If the issue persists, contact your internet provider.",
        },
        {
            question: "How do I reset my password?",
            answer: "Go to the login page and click on 'Forgot Password.' Follow the instructions to reset your password. If you don’t receive a reset email, check your spam folder or contact IT support.",
        },
        {
            question: "How do I update my computer’s operating system?",
            answer: "Go to your system settings, find the 'Update' section, and check for updates. Install any pending updates to keep your system secure and running smoothly.",
        },
        {
            question: "Why is my computer overheating?",
            answer: "Check if the cooling fans are running properly. Clean dust from vents and avoid using your computer on soft surfaces that block airflow. If overheating persists, consider replacing the thermal paste or using a cooling pad.",
        },
        {
            question: "Why does my computer randomly shut down?",
            answer: "This could be due to overheating, hardware failure, or a faulty power supply. Check the event logs for errors, and ensure your system is properly ventilated.",
        },
        {
            question: "What should I do if my computer is stuck on a boot loop?",
            answer: "Try restarting in Safe Mode and checking for recent updates or installations that may have caused the issue. If necessary, perform a system restore.",
        },
        {
            question: "Why is my external hard drive not detected?",
            answer: "Ensure the drive is properly connected and try a different USB port. If it's still not recognized, check Disk Management (Windows) or Disk Utility (Mac) to see if it needs to be initialized or formatted.",
        },
        {
            question: "Why can't I hear sound from my computer?",
            answer: "Check if the volume is muted or too low. Make sure your speakers or headphones are properly connected. If the issue persists, update or reinstall audio drivers.",
        },
        {
            question: "Why is my mouse or keyboard not working?",
            answer: "Try reconnecting the device or replacing the batteries if it's wireless. Check if drivers need to be updated, and test the device on another computer if possible.",
        },
        {
            question: "Why does my screen flicker or go black?",
            answer: "This could be due to a loose cable, outdated graphics drivers, or a failing monitor. Try adjusting your refresh rate and updating drivers.",
        },
        {
            question: "Why is my Wi-Fi disconnecting frequently?",
            answer: "Ensure you're within range of the router and that no interference is causing issues. Restart the router and update your network drivers.",
        },
        {
            question: "What should I do if my computer is infected with a virus?",
            answer: "Run a full system scan with an antivirus program. If malware is detected, remove it and restart your system. In severe cases, consider reinstalling your operating system.",
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100 text-base">
            <Sidebar />
            <div className="flex-1 p-6 px-16 min-h-screen relative">
                <Header user={user} />
                <div className="flex flex-col items-start p-6 w-full">
                    <h1 className="text-gray-800 text-2xl font-bold mb-6 self-start">Knowledge Base</h1>
                    <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-200 h-[78vh] overflow-y-auto">
                        {faqData.map((item, index) => (
                            <div key={index} className="border-b last:border-none">
                                <button
                                    onClick={() => toggleAnswer(index)}
                                    className="w-full text-left flex justify-between items-center p-4 text-lg font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition duration-300"
                                >
                                    {item.question}
                                    {openIndex === index ? <FaMinus className="text-gray-400" /> : <FaPlus className="text-gray-800" />}
                                </button>
                                {openIndex === index && (
                                    <div className="p-4 text-gray-750 bg-gray-100 rounded-b-lg text-lg">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    
    
};

export default KnowledgeBase;
