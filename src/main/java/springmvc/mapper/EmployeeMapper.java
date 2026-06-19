package springmvc.mapper;

import springmvc.model.Employee;

import java.sql.ResultSet;
import java.sql.SQLException;

public class EmployeeMapper {
    public static Employee mapEmployee(ResultSet rs) {
        try {
            Employee emp = new Employee();
            emp.setId(rs.getInt("id"));
            emp.setName(rs.getString("name"));
            emp.setPosition(rs.getString("position"));
            emp.setDateOfBirth(rs.getDate("dateofbirth"));
            emp.setDateOfJoining(rs.getDate("dateofjoining"));
            emp.setAadharNumber(rs.getString("aadharnumber"));
            emp.setESINo(rs.getString("esino"));
            emp.setEsiContribution(rs.getInt("esicontribution"));
            return emp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
