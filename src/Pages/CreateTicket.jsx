import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import ClickAwayListener from "react-click-away-listener";
import { Link, Paperclip, Smile } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [ticketId, setTicketId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    if (emojiObject.emoji) {
      setDescription((prev) => prev + emojiObject.emoji);
    }
  };

  const handleClickOutside = () => {
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    let missingFields = [];

    if (!department) missingFields.push("Department");
    if (!priority) missingFields.push("Priority");
    if (!category) missingFields.push("Category");
    if (!subject) missingFields.push("Subject");
    if (!description) missingFields.push("Description");

    if (missingFields.length > 0) {
      toast.error(`Please complete: ${missingFields.join(", ")}`);
      return;
    }

    try {
      const authToken = localStorage.getItem("accessToken");
      if (!authToken) {
        toast.error("No authentication token found");
        return;
      }

      const url = `http://localhost:5215/api/ticket/Ticket/create_new?department=${encodeURIComponent(
        department
      )}&priority=${encodeURIComponent(priority)}&category=${encodeURIComponent(category)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ subject, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create ticket");
      }

      const responseData = await response.json();
      setTicketId(responseData.id);
      toast.success("Ticket created successfully!");
    } catch (error) {
      toast.error(error.message || "Error creating ticket");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 px-16 overflow-y-auto">
        <Header />
        <div className="p-10 border rounded-2xl shadow-lg w-full h-5/6 mx-auto mt-10 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-semibold">
              New
            </span>
            <span className="text-gray-700 font-medium">Ticket</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
              <label className="block text-gray-700 font-medium mb-1">Department</label>
              <select
                className="w-full p-2 border rounded-md"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="" disabled>Select Department</option>
                <option value="SALES">Sales</option>
                <option value="MARKETING">Marketing</option>
                <option value="CUSTOMER_SERVICE">Customer Service</option>
                <option value="OPERATIONS">Operations</option>
                <option value="TREASURY">Treasury</option>
                <option value="HUMAN_RESOURCES">Human Resources</option>
              </select>

              <div className="flex gap-2 mt-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Type</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="NETWORK">Network</option>
                    <option value="TRANSACTION">Transaction</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="HARDWARE">Hardware</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Priority</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="" disabled>Select Priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Subject:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

<label className="block text-gray-800 font-semibold text-lg mb-2">
                Description:
              </label>
              <div className="border rounded-lg p-4 h-52 bg-gray-100 flex flex-col relative">
                <textarea
                  className="w-full h-full bg-transparent resize-none outline-none text-lg"
                  placeholder="Enter details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <div className="flex items-center gap-4 mt-3 text-gray-600 text-lg">
                  {/* Emoji Icon */}
                  <span className="cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile size={22} />
                  </span>

                  {/* Link Icon */}
                  <span className="cursor-pointer">
                    <Link size={22} />
                  </span>

                  {/* Attachment Icon */}
                  <span className="cursor-pointer">
                    <Paperclip size={22} />
                  </span>
                </div>

                {showEmojiPicker && (
                  <ClickAwayListener onClickAway={handleClickOutside}>
                    <div
                      ref={emojiPickerRef}
                      className="absolute top-0 right-[calc(100%+200px)] bg-white shadow-lg rounded-md p-2 z-50 w-60 h-72"
                    >
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  </ClickAwayListener>
                )}

              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  className="bg-blue-700 text-white px-6 py-2 rounded-md text-lg font-medium shadow-md hover:bg-blue-800"
                  onClick={handleSubmit}
                >
                  Submit Ticket
                </button>
              </Dialog.Trigger>
              {ticketId && (
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <Dialog.Title className="text-lg font-bold">Ticket Created</Dialog.Title>
                    <p className="mt-2">Your ticket (ID: {ticketId}) has been successfully created!</p>
                    <Dialog.Close
                      className="mt-4 bg-blue-900 text-white px-4 py-2 rounded"
                      onClick={() => navigate("/staffDashboard")}
                    >
                      Close
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              )}


            </Dialog.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
