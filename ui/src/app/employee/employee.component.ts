import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  departments: any = [];
  employees: any = [];

  modalTitle = '';
  EmployeeId = 0;
  EmployeeName = "";
  Department = "";
  DateofJoining = "";
  PhotoFileName = "anonymous.png";
  PhotoPath = environment.PHOTO_URL;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.refreshList();
  }
  refreshList() {
    this.http.get<any>(environment.API_URL + 'employee').subscribe(data => {
      this.employees = data;
    })
    this.http.get<any>(environment.API_URL + 'department').subscribe(data => {
      this.departments = data;
    })
  }
  addClick() {
    this.modalTitle = "Add Employee";
    this.EmployeeId = 0;
    this.EmployeeName = "";
    this.Department = "";
    this.DateofJoining = "";
    this.PhotoFileName = "anonymous.png";
  }
  editClick(emp: any) {
    this.modalTitle = "Edit Employee";
    this.EmployeeId = emp.EmployeeId;
    this.EmployeeName = emp.EmployeeName;
    this.Department = emp.Department;
    this.DateofJoining = emp.DateofJoining;
    this.PhotoFileName = emp.PhotoFileName;
  }

  createClick() {
    var val = {
      EmployeeName: this.EmployeeName,
      Department: this.Department,
      DateofJoining: this.DateofJoining,
      PhotoFileName: this.PhotoFileName,
    }
    this.http.post(environment.API_URL + 'employee', val).subscribe(res => {
      alert(res.toString());
      this.refreshList();
    })
  }
  updateClick() {
    var val = {
      EmployeeId: this.EmployeeId,
      EmployeeName: this.EmployeeName,
      Department: this.Department,
      DateofJoining: this.DateofJoining,
      PhotoFileName: this.PhotoFileName,
    }
    this.http.put(environment.API_URL + 'employee', val).subscribe(res => {
      alert(res.toString());
      this.refreshList();
    })
  }

  deleteClick(empId: any) {
    if (confirm('Are you Sure?')) {
      this.http.delete(environment.API_URL + 'employee/' + empId).subscribe(res => {
        alert(res.toString());
        this.refreshList();
      })
    }
  }
  imageUpload(event: any) {
    var file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    this.http.post(environment.API_URL + 'employee/savefile', formData).subscribe(res => {
      this.PhotoFileName = res.toString();
    })
  }

}
