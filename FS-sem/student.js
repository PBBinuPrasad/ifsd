const prompt=require("prompt-sync")();
class Student {
  constructor(name, grade) {
    this.name = name;
    this.grade = grade;
  }
}

class GradeCalculator {
  constructor() {
    this.students = [];
  }

  addStudent(name, grade) {
    const student = new Student(name, grade);
    this.students.push(student);
  }

  calculateAverageGrade() {
    if (this.students.length === 0) {
      return 0;
    }

    let totalGrade = 0;
    for (const student of this.students) {
      totalGrade += student.grade;
    }

    const averageGrade = totalGrade / this.students.length;
    return averageGrade;
  }
}

function main() {
  const calculator = new GradeCalculator();

  const n = parseInt(prompt("Enter the number of students:"));

  for (let i = 0; i < n; i++) {
    const name = prompt(`Enter the name of student ${i + 1}:`);
    const grade = parseFloat(prompt(`Enter the grade of student ${i + 1}:`));
    calculator.addStudent(name, grade);
  }

  const averageGrade = calculator.calculateAverageGrade();
  console.log("Average grade:", averageGrade);
}

main();