import { useEffect, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import * as XLSX from "xlsx";
import ExcelReaderTailwind from "./Excel";

gsap.registerPlugin(Draggable);

function Home() {
  const [classes, setClasses] = useState({});
  const [hall, setHall] = useState([]);
  const [hallDetails, setHallDetails] = useState({ name: "", size: 0 });
  const [assignments, setAssignments] = useState({});

  // Handle class data from Excel component
  const handleClassUpdate = (classData) => {
    console.log("Received class data from Excel:", classData);
    setClasses(classData);
  };

  // Add a new hall
  function handleHallSubmit() {
    if (!hallDetails.name || hallDetails.size <= 0) {
      alert("Please enter valid hall name and size");
      return;
    }
    
    // Check if hall name already exists
    if (hall.some(h => h.name === hallDetails.name)) {
      alert("Hall name already exists!");
      return;
    }
    
    const newHall = { 
      ...hallDetails, 
      size: Number(hallDetails.size) 
    };
    
    setHall([...hall, newHall]);
    setAssignments({
      ...assignments,
      [hallDetails.name]: { 
        students: [], 
        filled: 0, 
        remaining: Number(hallDetails.size), 
        assignedClasses: [] 
      },
    });
    setHallDetails({ name: "", size: 0 });
  }

  // Assign class to hall with proportional split
  function assignClassToHall(className, hallName) {
    setAssignments((prevAssignments) => {
      const hallInfo = prevAssignments[hallName];
      if (!hallInfo) return prevAssignments;

      // Check if class is already assigned to this hall
      if (hallInfo.assignedClasses.includes(className)) {
        console.log(`Class ${className} already assigned to ${hallName}`);
        return prevAssignments;
      }

      const hallCapacity = hall.find(h => h.name === hallName)?.size || 0;
      const newAssignedClasses = [...hallInfo.assignedClasses, className];
      const numClasses = newAssignedClasses.length;

      // Calculate equal share per class
      const perClassShare = Math.floor(hallCapacity / numClasses);

      // First, return previously assigned students back to their classes
      const studentsToReturn = {};
      hallInfo.students.forEach(student => {
        if (!studentsToReturn[student.className]) {
          studentsToReturn[student.className] = [];
        }
        studentsToReturn[student.className].push(student.regno);
      });

      // Update classes with returned students
      const updatedClassesState = { ...classes };
      Object.entries(studentsToReturn).forEach(([cName, regnos]) => {
        if (updatedClassesState[cName]) {
          updatedClassesState[cName] = [...updatedClassesState[cName], ...regnos];
        }
      });

      // Now redistribute equally
      let newHallStudents = [];
      const finalClassesState = { ...updatedClassesState };

      newAssignedClasses.forEach((cName) => {
        const availableStudents = finalClassesState[cName] || [];
        const studentsToTake = Math.min(perClassShare, availableStudents.length);
        
        // Take students for this hall
        const taken = availableStudents.slice(0, studentsToTake);
        newHallStudents.push(...taken.map((regno) => ({ 
          regno, 
          className: cName 
        })));
        
        // Remaining students in class
        finalClassesState[cName] = availableStudents.slice(studentsToTake);
      });

      // Update global class state
      setClasses(finalClassesState);

      return {
        ...prevAssignments,
        [hallName]: {
          students: newHallStudents,
          filled: newHallStudents.length,
          remaining: hallCapacity - newHallStudents.length,
          assignedClasses: newAssignedClasses,
        },
      };
    });
  }

  // Make classes draggable
  useEffect(() => {
    const boxes = gsap.utils.toArray(".box");

    boxes.forEach((box) => {
      Draggable.create(box, {
        bounds: "main",
        inertia: true,
        onDragEnd() {
          const hallElements = document.querySelectorAll(".hall");
          let dropped = false;

          hallElements.forEach((hallEl) => {
            const rect1 = box.getBoundingClientRect();
            const rect2 = hallEl.getBoundingClientRect();
            const overlap = !(
              rect1.right < rect2.left ||
              rect1.left > rect2.right ||
              rect1.bottom < rect2.top ||
              rect1.top > rect2.bottom
            );

            if (overlap) {
              const className = box.dataset.name;
              const hallName = hallEl.dataset.name;
              assignClassToHall(className, hallName);
              dropped = true;
            }
          });

          if (!dropped) {
            gsap.to(box, { 
              x: 0, 
              y: 0, 
              duration: 0.5, 
              ease: "elastic.out(1,0.5)" 
            });
          }
        },
      });
    });
  }, [classes, hall]);

  // Export hall-wise Excel
  function exportExcel() {
    if (hall.length === 0) {
      alert("No halls to export!");
      return;
    }

    const wb = XLSX.utils.book_new();

    hall.forEach((h) => {
      const hallAssign = assignments[h.name]?.students || [];
      const classNames = [...new Set(hallAssign.map((s) => s.className))];

      if (classNames.length === 0) {
        // Empty hall - create empty sheet
        const ws = XLSX.utils.aoa_to_sheet([["No assignments"]]);
        XLSX.utils.book_append_sheet(wb, ws, h.name);
        return;
      }

      // Build rows: each row = a set of roll numbers for each class
      const maxRows = Math.max(...classNames.map((cn) => 
        hallAssign.filter((s) => s.className === cn).length
      ));
      
      const data = [classNames]; // header row = class names

      for (let i = 0; i < maxRows; i++) {
        const row = classNames.map((cn) => {
          const students = hallAssign.filter((s) => s.className === cn);
          return students[i]?.regno || "";
        });
        data.push(row);
      }

      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, h.name);
    });

    XLSX.writeFile(wb, "Hall_Assignments.xlsx");
  }

  return (
    <main className="bg-orange-50 min-h-screen w-screen flex flex-col items-center overflow-auto p-5">
      {/* Excel Reader Component - Properly placed in JSX */}
      <ExcelReaderTailwind updatedClass={handleClassUpdate} />
      
      {/* Input Section */}
      <div className="flex justify-around items-center space-x-6 w-[50vw] mt-6">
        <input
          className="bg-white shadow-lg px-4 py-3 rounded-lg text-md text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          type="text"
          placeholder="Enter hall name"
          value={hallDetails.name}
          onChange={(e) => setHallDetails({ ...hallDetails, name: e.target.value })}
        />
        <input
          className="bg-white shadow-lg px-4 py-3 rounded-lg text-md text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          type="number"
          placeholder="Hall size"
          value={hallDetails.size}
          onChange={(e) => setHallDetails({ ...hallDetails, size: parseInt(e.target.value) || 0 })}
          min="1"
        />
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleHallSubmit} 
            className="bg-orange-500 shadow-lg px-5 text-xl text-white font-semibold py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Add Hall
          </button>
          <button 
            onClick={exportExcel} 
            className="bg-orange-50 border-2 border-orange-500 text-orange-500 border-b-4 border-b-orange-500 shadow-lg px-5 text-xl font-semibold py-2 rounded-md hover:bg-orange-100 transition-colors"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Classes Section */}
      <div className="bg-[#FFEBD2] pt-2 w-[80vw] px-5 rounded-md mt-10 flex justify-around items-center flex-wrap gap-2">
        {Object.entries(classes).map(([name, students]) => (
          <div
            key={name} 
            style={{"backgroundColor": (students.length > 0) ? "#f97316" : "gray"}}
            className="my-2 rounded-lg w-28 h-20 text-white text-lg font-bold text-center box flex items-center justify-center cursor-pointer shadow-md"
            data-name={name}
          >
            {name} ({students.length})
          </div>
        ))}
      </div>

      {/* Halls Section */}
      <div className="flex justify-around w-full mt-10 flex-wrap gap-5">
        {hall.map((item) => (
          <div
            key={item.name}
            data-name={item.name}
            className="hall w-60 h-60 border-2 border-orange-400 bg-orange-100 text-orange-500 p-3 rounded-lg relative shadow-lg"
          >
            <h1 className="text-xl text-center font-bold mb-2">{item.name}</h1>
            <p className="text-center">Capacity: {item.size}</p>
            <p className="text-center">Filled: {assignments[item.name]?.filled || 0}</p>
            <p className="text-center mb-4">Remaining: {assignments[item.name]?.remaining || item.size}</p>
            
            {/* Show assigned classes */}
            {assignments[item.name]?.assignedClasses.length > 0 && (
              <div className="mt-2">
                <p className="text-center font-semibold mb-1">Assigned Classes:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {assignments[item.name].assignedClasses.map((className) => (
                    <span 
                      key={className} 
                      className="bg-orange-200 text-orange-700 px-2 py-1 rounded text-sm"
                    >
                      {className}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default Home;