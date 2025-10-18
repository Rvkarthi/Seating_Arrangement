import { useEffect, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

gsap.registerPlugin(Draggable);

function Home() {
  const [classes, setClasses] = useState({
  "II CSE A": [
    820324104001, 820324104002, 820324104003, 820324104004, 820324104005,
    820324104006, 820324104007, 820324104008, 820324104009, 820324104010,
    820324104011, 820324104012, 820324104013, 820324104014, 820324104015,
    820324104016, 820324104017, 820324104018, 820324104019, 820324104020,
    820324104021, 820324104022, 820324104023, 820324104024, 820324104025,
    820324104026, 820324104027, 820324104028, 820324104029, 820324104030,
    820324104031, 820324104032, 820324104033, 820324104034, 820324104035,
    820324104036, 820324104037, 820324104038, 820324104039, 820324104040,
    820324104041, 820324104042, 820324104043, 820324104044, 820324104045,
    820324104046, 820324104047, 820324104048, 820324104049, 820324104050,
    820324104051, 820324104052, 820324104053, 820324104054, 820324104055,
    820324104056, 820324104057, 820324104058, 820324104059, 820324104060
  ],
  "III CSE A": [
    820323104001, 820323104002, 820323104003, 820323104004, 820323104005,
    820323104006, 820323104007, 820323104008, 820323104009, 820323104010,
    820323104011, 820323104012, 820323104013, 820323104014, 820323104015,
    820323104016, 820323104017, 820323104018, 820323104019, 820323104020,
    820323104021, 820323104022, 820323104023, 820323104024, 820323104025,
    820323104026, 820323104027, 820323104028, 820323104029, 820323104030,
    820323104031, 820323104032, 820323104033, 820323104034, 820323104035,
    820323104036, 820323104037, 820323104038, 820323104039, 820323104040,
    820323104041, 820323104042, 820323104043, 820323104044, 820323104045,
    820323104046, 820323104047, 820323104048, 820323104049, 820323104050,
    820323104051, 820323104052, 820323104053, 820323104054, 820323104055,
    820323104056, 820323104057, 820323104058, 820323104059, 820323104060
  ],
  "II CSE B": [
    820324104061, 820324104062, 820324104063, 820324104064, 820324104065,
    820324104066, 820324104067, 820324104068, 820324104069, 820324104070,
    820324104071, 820324104072, 820324104073, 820324104074, 820324104075,
    820324104076, 820324104077, 820324104078, 820324104079, 820324104080,
    820324104081, 820324104082, 820324104083, 820324104084, 820324104085,
    820324104086, 820324104087, 820324104088, 820324104089, 820324104090,
    820324104091, 820324104092, 820324104093, 820324104094, 820324104095,
    820324104096, 820324104097, 820324104098, 820324104099, 820324104100,
    820324104101, 820324104102, 820324104103, 820324104104, 820324104105,
    820324104106, 820324104107, 820324104108, 820324104109, 820324104110,
    820324104111, 820324104112, 820324104113, 820324104114, 820324104115,
    820324104116, 820324104117, 820324104118, 820324104119, 820324104120
  ],
  "III CSE B": [
    820323104061, 820323104062, 820323104063, 820323104064, 820323104065,
    820323104066, 820323104067, 820323104068, 820323104069, 820323104070,
    820323104071, 820323104072, 820323104073, 820323104074, 820323104075,
    820323104076, 820323104077, 820323104078, 820323104079, 820323104080,
    820323104081, 820323104082, 820323104083, 820323104084, 820323104085,
    820323104086, 820323104087, 820323104088, 820323104089, 820323104090,
    820323104091, 820323104092, 820323104093, 820323104094, 820323104095,
    820323104096, 820323104097, 820323104098, 820323104099, 820323104100,
    820323104101, 820323104102, 820323104103, 820323104104, 820323104105,
    820323104106, 820323104107, 820323104108, 820323104109, 820323104110,
    820323104111, 820323104112, 820323104113, 820323104114, 820323104115,
    820323104116, 820323104117, 820323104118, 820323104119, 820323104120
  ],
  "IV CSE": [
    820322104001, 820322104002, 820322104003, 820322104004, 820322104005,
    820322104006, 820322104007, 820322104008, 820322104009, 820322104010,
    820322104011, 820322104012, 820322104013, 820322104014, 820322104015,
    820322104016, 820322104017, 820322104018, 820322104019, 820322104020,
    820322104021, 820322104022, 820322104023, 820322104024, 820322104025,
    820322104026, 820322104027, 820322104028, 820322104029, 820322104030,
    820322104031, 820322104032, 820322104033, 820322104034, 820322104035,
    820322104036, 820322104037, 820322104038, 820322104039, 820322104040,
    820322104041, 820322104042, 820322104043, 820322104044, 820322104045,
    820322104046, 820322104047, 820322104048, 820322104049, 820322104050,
    820322104051, 820322104052, 820322104053, 820322104054, 820322104055,
    820322104056, 820322104057, 820322104058, 820322104059, 820322104060
  ]
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
    // setHallDetails({ name: "", size: 0 });
  }

  // Assign class to hall with proportional split
  function assignClassToHall(className, hallName) {
  setAssignments((prev) => {
    const hallInfo = prev[hallName];
    if (!hallInfo) return prev;

    // Check if class is already assigned to this hall
    if (hallInfo.assignedClasses.includes(className)) return prev;

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
    let updatedClassesState = { ...classes };
    Object.entries(studentsToReturn).forEach(([cName, regnos]) => {
      updatedClassesState[cName] = [...regnos, ...updatedClassesState[cName]];
    });

    // Now redistribute equally
    let newHallStudents = [];
    let finalClassesState = {};

    newAssignedClasses.forEach((cName) => {
      const availableStudents = updatedClassesState[cName];
      const studentsToTake = Math.min(perClassShare, availableStudents.length);
      
      // Take students for this hall
      const taken = availableStudents.slice(0, studentsToTake);
      newHallStudents.push(...taken.map((regno) => ({ regno, className: cName })));
      
      // Remaining students in class
      finalClassesState[cName] = availableStudents.slice(studentsToTake);
    });

    const updatedAssignments = {
      ...prev,
      [hallName]: {
        students: newHallStudents,
        filled: newHallStudents.length,
        remaining: hallCapacity - newHallStudents.length,
        assignedClasses: newAssignedClasses,
      },
    };

    // Update global class state
    setClasses((prevClasses) => ({
      ...prevClasses,
      ...finalClassesState,
    }));

    return updatedAssignments;
  });
}
handleHallSubmit
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
    <main className="bg-orange-50 h-[100vh] w-screen flex flex-col items-center overflow-auto p-5">
      {/* Input */}
      <div className="flex justify-around items-center space-x-6  w-[50vw]">
        <input
          className="bg-white shadow-lg px-4 py-3 rounded-lg text-md text-orange-500"
          type="text"
          placeholder="Enter hall name"
          value={hallDetails.name}
          onChange={(e) => setHallDetails({ ...hallDetails, name: e.target.value })}
        />
        <input
          className="bg-white shadow-lg px-4 py-3 rounded-lg text-md text-orange-500"
          type="number"
          placeholder="Hall size"
          value={hallDetails.size}
          onChange={(e) => setHallDetails({ ...hallDetails, size: e.target.value })}
        />
        <div className="flex items-center space-x-6">
          <button onClick={handleHallSubmit} className="bg-orange-500 shadow-lg px-5 text-xl text-white font-semibold py-2 rounded-md">
          Add
        </button>
        <button onClick={exportExcel} className="bg-orange-50 border-2 border-orange-500 text-orange-500 border-b-4 border-b-orange-500 shadow-lg px-5 text-xl font-semibold py-2 rounded-md">
          Export 
        </button>
        </div>
      </div>

      {/* Classes */}
      <div className="bg-[#FFEBD2] pt-2 w-[80vw] px-5 rounded-md mt-10 flex justify-around items-center flex-wrap gap-2">
        {Object.entries(classes).map(([name, students]) => (
          <div
            key={name} style={{"backgroundColor": (students.length>0)? "#f97316" : "gray"}}
            className="bg-orange-500 my-2 rounded-lg w-28 h-20 text-white text-lg font-bold text-center box flex items-center justify-center cursor-pointer"
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
            className="hall w-60 h-60 border-2 border-orange-400 bg-orange-100 text-orange-500 p-3 rounded-lg relative"
          >
            <h1 className="text-xl text-center font-bold">{item.name}</h1>
            <p className="text-center">Capacity: {item.size}</p>
            <p className="text-center">Filled: {assignments[item.name]?.filled || 0}</p>
            <p className="text-center">Remaining: {assignments[item.name]?.remaining || item.size}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Home;
