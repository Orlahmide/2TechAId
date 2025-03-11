import React from "react";

const employees = [
  { name: "Leasie Watson", ctc: "$45000", salary: "$3500", deduction: "-", status: "Completed", image: "https://randomuser.me/api/portraits/women/1.jpg" },
  { name: "Darlene Robertson", ctc: "$78000", salary: "$6400", deduction: "$100", status: "Completed", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Jacob Jones", ctc: "$60000", salary: "$5000", deduction: "$250", status: "Completed", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Kathryn Murphy", ctc: "$34000", salary: "$2800", deduction: "-", status: "Pending", image: "https://randomuser.me/api/portraits/women/3.jpg" },
  { name: "Leslie Alexander", ctc: "$40000", salary: "$3400", deduction: "-", status: "Pending", image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Ronald Richards", ctc: "$45000", salary: "$3500", deduction: "-", status: "Completed", image: "https://randomuser.me/api/portraits/men/3.jpg" },
  { name: "Guy Hawkins", ctc: "$55000", salary: "$4000", deduction: "$50", status: "Pending", image: "https://randomuser.me/api/portraits/men/4.jpg" },
  { name: "Albert Flores", ctc: "$60000", salary: "$5000", deduction: "$150", status: "Completed", image: "https://randomuser.me/api/portraits/men/5.jpg" },
  { name: "Savannah Nguyen", ctc: "$25000", salary: "$2200", deduction: "-", status: "Pending", image: "https://randomuser.me/api/portraits/women/4.jpg" },
  { name: "Marvin McKinney", ctc: "$30000", salary: "$2700", deduction: "-", status: "Completed", image: "https://randomuser.me/api/portraits/men/6.jpg" },
  { name: "Jerome Bell", ctc: "$78000", salary: "$6400", deduction: "-", status: "Completed", image: "https://randomuser.me/api/portraits/men/7.jpg" },
  { name: "Jenny Wilson", ctc: "$45000", salary: "$3500", deduction: "$100", status: "Pending", image: "https://randomuser.me/api/portraits/women/5.jpg" }
];

const PayrollPage = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-xl font-semibold mb-2">Payroll</h2>
      <p className="text-gray-500 mb-4">All Employee Payroll</p>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 border rounded-md shadow-sm"
        />
      </div>
      <div className="border rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="p-3">Employee Name</th>
              <th className="p-3">CTC</th>
              <th className="p-3">Salary Per Month</th>
              <th className="p-3">Deduction</th>
              {/* Apply a fixed width to the status column */}
              <th className="p-3">Status</th> 
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <img src={employee.image} alt="User" className="w-8 h-8 rounded-full" />
                  {employee.name}
                </td>
                <td className="p-3">{employee.ctc}</td>
                <td className="p-3">{employee.salary}</td>
                <td className="p-3">{employee.deduction}</td>
                <td className="p-3">
                  {/* Use fixed width for the status */}
                  <span
                    className={`inline-block w-28 text-center px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
        <div>
          Showing <select className="border p-1 rounded"> <option>10</option> </select>
        </div>
        <div>Showing 1 to 10 out of 60 records</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 border rounded">&lt;</button>
          {[1, 2, 3, 4].map((num) => (
            <button key={num} className={`px-2 py-1 border rounded ${num === 1 ? "bg-blue-500 text-white" : ""}`}>{num}</button>
          ))}
          <button className="px-2 py-1 border rounded">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
