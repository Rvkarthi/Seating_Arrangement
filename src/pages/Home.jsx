import { useEffect, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

gsap.registerPlugin(Draggable);

function Home() {
  const [classes, setClasses] = useState({
    "II CSE A": [820324104017, 820324104018, 820324104020, 820324104022, 820324104026, 820324104030],
    "III CSE A": [820323104032, 820323104033, 820323104035, 820323104036, 820323104041, 820323104043],
    "II CSE B": [820324104094, 820324104096, 820324104098, 820324104099, 820324104100, 820324104101],
    "III CSE B": [820323104087, 820323104088, 820323104090, 820323104092, 820323104093, 820323104096],
    "IV CSE": [820322104001, 820322104003, 820322104010, 820322104012, 820322104013, 820322104014],
  });

  const [hall, setHall] = useState([]);
  const [hallDetails, setHallDetails] = useState({ name: "", size: 0 });
  const [assignments, setAssignments] = useState({});

  // Add a new hall
  function handleHallSubmit() {
    if (!hallDetails.name || hallDetails.size <= 0) return;
    setHall([...hall, { ...hallDetails, size: Number(hallDetails.size) }]);
    setAssignments({
      ...assignments,
      [hallDetails.name]: { students: [], filled: 0, remaining: Number(hallDetails.size), assignedClasses: [] },
    });
    setHallDetails({ name: "", size: 0 });
  }

  // Assign class to hall with proportional split
  function assignClassToHall(className, hallName) {
    setAssignments((prev) => {
      const hallInfo = prev[hallName];
      if (!hallInfo) return prev;

      const newClassStudents = classes[className].map((regno) => ({ regno, className }));
      const allClasses = Array.from(new Set([...hallInfo.assignedClasses, className]));
      let combinedStudents = [...hallInfo.students, ...newClassStudents];
      const hallCapacity = hallInfo.filled + hallInfo.remaining;
      const totalClasses = allClasses.length;
      const perClassShare = Math.floor(hallCapacity / totalClasses);

      let hallStudents = [];
      allClasses.forEach((cName) => {
        const classStudents = combinedStudents.filter((s) => s.className === cName);
        hallStudents.push(...classStudents.slice(0, perClassShare));
      });

      const updatedAssignments = {
        ...prev,
        [hallName]: {
          students: hallStudents,
          filled: hallStudents.length,
          remaining: hallCapacity - hallStudents.length,
          assignedClasses: allClasses,
        },
      };

      setClasses((prevClasses) => {
        const updatedClasses = { ...prevClasses };
        allClasses.forEach((cName) => {
          const classStudents = combinedStudents.filter((s) => s.className === cName);
          updatedClasses[cName] = classStudents.slice(perClassShare).map((s) => s.regno);
        });
        return updatedClasses;
      });

      return updatedAssignments;
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

          gsap.to(box, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
        },
      });
    });
  }, [classes, hall, assignments]);

  // Export hall-wise Excel
  function exportExcel() {
    const wb = XLSX.utils.book_new();

    hall.forEach((h) => {
      const hallAssign = assignments[h.name]?.students || [];
      const classNames = [...new Set(hallAssign.map((s) => s.className))];

      // Build rows: each row = a set of roll numbers for each class
      const maxRows = Math.max(...classNames.map((cn) => hallAssign.filter((s) => s.className === cn).length));
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
    <main className="bg-red-500 h-[100vh] w-screen flex flex-col items-center overflow-auto p-5">
      {/* Input */}
      <div className="flex justify-around w-[50vw]">
        <input
          className="bg-white/70 px-4 mt-8 py-3 rounded-lg text-md text-black"
          type="text"
          placeholder="Enter hall name"
          value={hallDetails.name}
          onChange={(e) => setHallDetails({ ...hallDetails, name: e.target.value })}
        />
        <input
          className="bg-white/70 px-4 mt-8 py-3 rounded-lg text-md text-black"
          type="number"
          placeholder="Hall size"
          value={hallDetails.size}
          onChange={(e) => setHallDetails({ ...hallDetails, size: e.target.value })}
        />
        <button onClick={handleHallSubmit} className="bg-green-500 px-5 text-2xl rounded-md mt-5">
          Add
        </button>
        <button onClick={exportExcel} className="bg-blue-500 px-5 text-2xl rounded-md mt-5">
          Export Excel
        </button>
      </div>

      {/* Classes */}
      <div className="bg-white/10 pt-2 w-[80vw] h-[15vh] mt-10 flex justify-around flex-wrap gap-2">
        {Object.entries(classes).map(([name, students]) => (
          <div
            key={name}
            className="bg-red-900 w-28 h-20 text-white text-lg font-bold text-center box flex items-center justify-center cursor-pointer"
            data-name={name}
          >
            {name} ({students.length})
          </div>
        ))}
      </div>

      {/* Halls */}
      <div className="flex justify-around w-full mt-10 flex-wrap gap-5">
        {hall.map((item) => (
          <div
            key={item.name}
            data-name={item.name}
            className="hall w-60 h-60 bg-black text-white p-3 rounded-lg relative"
          >
            <h1 className="text-xl text-center font-bold">{item.name}</h1>
            <p className="text-center">Capacity: {item.size}</p>
            <p className="text-center">Filled: {assignments[item.name]?.filled || 0}</p>
            <p className="text-center">Remaining: {assignments[item.name]?.remaining || item.size}</p>

            <div className="absolute bottom-2 left-0 right-0 flex flex-wrap justify-center gap-1">
              {(assignments[item.name]?.students || []).map((s) => (
                <div key={s.regno} className="bg-white text-black text-xs px-1 rounded">
                  {s.regno.toString().slice(-3)} ({s.className})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Home;
