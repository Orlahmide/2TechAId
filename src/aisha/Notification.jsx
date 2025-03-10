import React from "react";

const notifications = [
  {
    id: 1,
    name: "Robert Fox",
    title: "Leave Request",
    message: "@Robert Fox has applied for leave",
    time: "Just Now",
    image: "https://th.bing.com/th/id/OIP.9w39gOogiW0CzEDNINjnwQHaE7?rs=1&pid=ImgDetMain"
  },
  {
    id: 2,
    name: "Alexa",
    title: "Check In Issue",
    message: "@Alexa shared a message regarding check-in issue",
    time: "11:16 AM",
    image: "https://miro.medium.com/v2/resize:fit:2400/1*Mw1Yhy3Z3TiV0mZkF4UInw.jpeg"
  },
  {
    id: 3,
    name: "Shane Watson",
    title: "Applied job for \"Sales Manager\" Position",
    message: "@shane Watson has applied for job",
    time: "09:00 AM",
    image: "https://th.bing.com/th/id/OIP.K3J7a2RsMjozb6HT9wmxYQHaFj?rs=1&pid=ImgDetMain"
  },
  {
    id: 4,
    name: "Robert Fox",
    title: "Robert Fox has shared his feedback",
    message: "\"It was an amazing experience with your organisation\"",
    time: "Yesterday",
    image: "https://thumbs.dreamstime.com/z/pretty-woman-face-white-background-beautiful-woman-portrait-pretty-woman-face-white-background-beautiful-woman-portrait-188592492.jpg"
  },
  {
    id: 5,
    name: "System",
    title: "Password Update successfully",
    message: "Your password has been updated successfully",
    time: "Yesterday",
    image: "https://i.pinimg.com/736x/e1/08/a5/e108a56df4dfff6135af75959142f79f.jpg"
  }
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-xl font-semibold mb-2">Notifications</h2>
      <p className="text-gray-500 mb-4">All Notifications</p>
      <div className="border rounded-lg p-4 shadow-md">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
            <img src={notification.image} alt="User" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold">{notification.title}</p>
              <p className="text-gray-500 text-sm">{notification.message}</p>
            </div>
            <span className="text-gray-400 text-sm">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;