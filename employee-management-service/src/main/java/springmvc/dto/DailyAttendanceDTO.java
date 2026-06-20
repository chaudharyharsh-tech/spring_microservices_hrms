package springmvc.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import springmvc.model.Employee;

import java.sql.Date;

public class DailyAttendanceDTO {
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date date;
    private Employee employee;
    private int attendance_Status;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public int getAttendance_Status() {
        return attendance_Status;
    }

    public void setAttendance_Status(int attendance_Status) {
        this.attendance_Status = attendance_Status;
    }
}
