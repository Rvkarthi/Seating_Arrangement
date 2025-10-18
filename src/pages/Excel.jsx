import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelReaderTailwind = ({ updatedClass }) => {
  const [classData, setClassData] = useState({});
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (data.length === 0) {
          console.warn("Excel file is empty");
          return;
        }

        const headers = data[0];
        const classObj = {};

        headers.forEach((header, colIndex) => {
          const students = [];
          for (let row = 1; row < data.length; row++) {
            const regNo = data[row][colIndex];
            if (regNo) students.push(regNo.toString());
          }
          classObj[header] = students;
        });

        setClassData(classObj);
        console.log("Class data processed:", classObj);
        
        // Call the prop function to send data to parent
        if (updatedClass) {
          updatedClass(classObj);
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file");
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="w-full bg-orange-100 p-6 rounded-lg shadow-md mb-6 flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-orange-600 mb-4 ">
        📘 Upload Class-wise Student Data
      </h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-full max-w-md"
      />
      
    </div>
  );
};

export default ExcelReaderTailwind;