const API_BASE_URL = "http://localhost:3000/api";

const loadingDiv = document.getElementById("loading");
const studentListDiv = document.getElementById("student-list");
const attendanceDetailsDiv = document.getElementById("attendance-details");
const studentsTbody = document.getElementById("students-tbody");
const attendanceTbody = document.getElementById("attendance-tbody");
const studentNameSpan = document.getElementById("student-name");
const allStd = document.getElementById("AllStd");

async function fetchStudents() {
  try {
    const response1 = await fetch(`${API_BASE_URL}/students`);
    const students = await response1.json();

    loadingDiv.style.display = "none";
    studentListDiv.style.display = "block";
    // console.log(students);
    for (const student of students) {
      const tr = document.createElement("tr");
      // Await the result of the async function
      const attendancePercentage = await calculateAttendancePercentage(
        student._id
      );

      tr.innerHTML = `
            <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${student.name}</p></td>
            <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${student.rollNumber}</p></td>
            <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${student.class}</p></td>
            <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${student.section}</p></td>
            <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${attendancePercentage}%</p></td>
            <td class=" border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"><button  class="m-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500" onclick="viewAttendance('${student._id}', '${student.name}')">View Details</button></p></td>
          `;
      studentsTbody.appendChild(tr);
    }
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

async function calculateAttendancePercentage(studentId) {
  // console.log("TEST");
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/${studentId}`);
    const attendanceRecords = await response.json();
    if (!attendanceRecords || attendanceRecords.length === 0) return 0;

    let totalClasses = 0;
    let attendedClasses = 0;

    attendanceRecords.forEach((record) => {
      totalClasses += record.totalClasses;
      attendedClasses += record.attendedClasses;
    });

    // console.log("TEST");

    // console.log((attendedClasses / totalClasses) * 100);
    return totalClasses > 0
      ? ((attendedClasses / totalClasses) * 100).toFixed(2)
      : 0;
  } catch {
    console.log("Error Fetching Attendance Records");
  }
}

// View attendance details for a specific student
async function viewAttendance(studentId, studentName) {
  try {
    allStd.style.display = "none";
    studentListDiv.style.display = "none";
    attendanceDetailsDiv.style.display = "block";
    studentNameSpan.textContent = studentName;
    attendanceTbody.innerHTML = "";

    const response = await fetch(`${API_BASE_URL}/attendance/${studentId}`);
    const attendanceRecords = await response.json();

    attendanceRecords.forEach((record) => {
      const attendancePercentage = (
        (record.attendedClasses / record.totalClasses) *
        100
      ).toFixed(2);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${record.subject}</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${record.totalClasses}</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${record.attendedClasses}</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${attendancePercentage}%</p></td>
        <td class="border-b border-blue-gray-50">
          <button class="m-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500" onclick="markAttendance('${record._id}', '${studentId}', 'present')">Present</button>
          <button class="m-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500" onclick="markAttendance('${record._id}', '${studentId}', 'absent')">Absent</button>
        </td>
      `;
      attendanceTbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching attendance details:", error);
  }
}

// Function to mark attendance (Present/Absent)
async function markAttendance(attendanceId, studentId, status) {
  try {
    // Send request to the backend to update attendance
    const response = await fetch(
      `${API_BASE_URL}/attendance/mark/${attendanceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, status }), // Send status ('present' or 'absent')
      }
    );

    const updatedRecord = await response.json();

    // Check if the response was successful
    if (updatedRecord.success) {
      // Ensure the student data is present in updatedRecord
      if (updatedRecord.attendance && updatedRecord.attendance.student) {
        // alert(`Attendance marked as ${status}`);
        // Pass the student data to refreshStudent for viewing
        refreshStudent(studentId, updatedRecord.attendance.student.name);
      } else {
        alert("Student data not found in the updated record.");
      }
    } else {
      alert("Error marking attendance. Please try again.");
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
  }
}

// Function to refresh student details after marking attendance
async function refreshStudent(studentId, studentName) {
  // Call viewAttendance and pass studentId and studentName
  await viewAttendance(studentId, studentName);
}

// Go back to the student list
function backToStudents() {
  attendanceDetailsDiv.style.display = "none";
  studentListDiv.style.display = "block";
  allStd.style.display = "block";
  // location.reload();
}

fetchStudents();
