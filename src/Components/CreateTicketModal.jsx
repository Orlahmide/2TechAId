import { useNavigate } from "react-router-dom";

export default function CreateTicketModal({ ticketId, onClose }) {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    onClose(); // Close the modal
    navigate("/staffDashboard"); // Navigate to dashboard
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border w-96 text-center">
        <div className="flex justify-center items-center w-16 h-16 bg-blue-900 rounded-xl mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">Ticket Created</h2>
        <p className="text-gray-700 mt-2">
          ID: <span className="font-bold text-black">{ticketId}</span>
        </p>
        <button
          onClick={handleBackToDashboard}
          className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
