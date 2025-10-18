import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelReaderTailwind = ({updatedClass}) => {
  const [classData, setClassData] = useState({});
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const headers = data[0];
      const classObj = {};

      headers.forEach((header, colIndex) => {
        const students = [];
        for (let row = 1; row < data.length; row++) {
          const regNo = data[row][colIndex];
          if (regNo) students.push(regNo);
        }
        classObj[header] = students;
      });

      setClassData(classObj);
    };

    reader.readAsBinaryString(file);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") setShowJSON((prev) => !prev);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-6 font-sans"
      tabIndex="0"
      onKeyDown={handleKeyPress}
    >
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        📘 Class-wise Student Data
      </h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      
      {Object.keys(classData).length > 0 && (
        <div className="flex gap-2 items-stretch">
          {Object.entries(classData).map(([className, students]) => (
            <div
              key={className}
              className="border-2 border-orange-400 rounded-xl p-4 bg-orange-50 shadow-md"
            >
              <h3 className="text-xl font-semibold text-orange-700 mb-2">
                Class {className}
              </h3>
              <p className="text-gray-700 mb-2">Total Students: {students.length}</p>
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExcelReaderTailwind;
