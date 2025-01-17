const API_BASE_URL = "http://localhost:3000/api";

async function fetchStudents() {
  const response = await fetch(`${API_BASE_URL}/students`);
  const students = await response.json();

  const tableBody = document.getElementById("students-table-body");
  tableBody.innerHTML = "";

  students.forEach((student) => {
    const row = `
      <tr>
        <td class="p-4 border-b border-blue-gray-50"><p class="px-4 block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"><input type="checkbox" class="student-checkbox" value="${student._id}"></p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${student.name}</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${student.rollNumber}</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${student.class}</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${student.section}</p></td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

async function assignSubject(event) {
  event.preventDefault();

  const checkboxes = document.querySelectorAll(".student-checkbox:checked");
  const studentIds = Array.from(checkboxes).map((cb) => cb.value);
  const subject = document.getElementById("subject").value;

  if (!subject.trim()) {
    alert("Please enter a subject.");
    return;
  }

  if (studentIds.length === 0) {
    alert("Please select at least one student.");
    return;
  }

  for (const studentId of studentIds) {
    const response = await fetch(`${API_BASE_URL}/attendance/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student: studentId,
        subject,
        totalClasses: 0,
        attendedClasses: 0,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Subject assigned to a student successfully!");
    } else {
      alert(`Error for student ${studentId}: ${result.message}`);
    }
  }

  fetchStudents();
}

window.onload = fetchStudents;
