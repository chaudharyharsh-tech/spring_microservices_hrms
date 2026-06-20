package springmvc.dao;

import springmvc.dto.DailyAttendanceDTO;
import springmvc.model.Employee;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeDao{
    void save(Employee employee);
    List<Employee> getAll();
    Employee getByID(int id);
    void delete(int id);
    boolean markAttendance(int id, int status_id, LocalDate date);
    List<DailyAttendanceDTO> getAttendanceStatuses(LocalDate date);
    List<DailyAttendanceDTO> getAttendanceByUser(int id);
}