package springmvc.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import springmvc.mapper.EmployeeMapper;
import springmvc.model.Employee;
import springmvc.dto.DailyAttendanceDTO;
import java.lang.reflect.Field;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.sql.DataSource;

@Repository
public class EmployeeDaoImpl implements EmployeeDao {

    private final DataSource dataSource;
    private static final Logger logger = LoggerFactory.getLogger(EmployeeDaoImpl.class);

    @Autowired
    public EmployeeDaoImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void save(Employee employee) {
        StringBuilder sqlColumns = new StringBuilder("INSERT INTO employee (id, ");
        StringBuilder sqlValues = new StringBuilder("VALUES (?, ");
        List<Object> parameters = new ArrayList<>();
        boolean hasFields = false;

        // 1. Get all fields declared in the Employee class using Reflection
        Field[] fields = employee.getClass().getDeclaredFields();

        for (Field field : fields) {
            // 2. Skip the ID field (auto-incremented by DB)
            if (field.getName().equalsIgnoreCase("id")) {
                continue;
            }

            // 3. Make private fields readable
            field.setAccessible(true);
            try {
                Object value = field.get(employee);

                // 4. If the value is not null, append it to our query builder
                if (value != null) {
                    sqlColumns.append(field.getName()).append(", ");
                    sqlValues.append("?, ");
                    parameters.add(value);
                    hasFields = true;
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException("Error reading field: " + field.getName(), e);
            }
        }

        if (!hasFields) {
            throw new IllegalArgumentException("Cannot save an empty employee object.");
        }

        // 5. Remove the trailing comma and space from both strings
        sqlColumns.setLength(sqlColumns.length() - 2);
        sqlValues.setLength(sqlValues.length() - 2);

        // 6. Close the parentheses and combine into the final SQL string
        sqlColumns.append(") ");
        sqlValues.append(")");
        String sql = sqlColumns.toString() + sqlValues.toString();

        try(Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, employee.getId());
            // 7. Loop through our parameters list and set them dynamically
            for (int i = 1; i < parameters.size() + 1; i++) {
                ps.setObject(i + 1, parameters.get(i-1));
            }

            ps.executeUpdate();
        } catch(SQLException e) {
            throw new RuntimeException("Error saving employee", e);
        }
    }

    @Override
    public List<Employee> getAll() {
        String sql = "SELECT * FROM employee";
        List<Employee> employees = new ArrayList<>();
        try(Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery()) {
            while(rs.next()) {
                Employee emp = new Employee();
                emp.setId(rs.getInt("id"));
                emp.setName(rs.getString("name"));
                emp.setPosition(rs.getString("position"));
                employees.add(emp);
            }
        } catch(SQLException e) {
            throw new RuntimeException("Error getting all employees", e);
        }
        return employees;
    }

    @Override
    public Employee getByID(int id) {
        String sql = "SELECT * FROM Employee WHERE id = ?";
        Employee emp = null;
        try(Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if(rs.next()) {
                    emp = EmployeeMapper.mapEmployee(rs);
                }
            }
        } catch(SQLException e) {
            throw new RuntimeException("Error getting employee by ID");
        }

        return emp;
    }

    @Override
    public boolean delete(int id) {
        String sql = "DELETE FROM employee WHERE id = ?";
        try(Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)){
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch(SQLException e) {
            throw new RuntimeException("Error deleting employee ", e);
        }
    }

    @Override
    public boolean markAttendance(int id, int status_id, LocalDate date) {
        logger.info("markAttendance called with id={}, status={}, date={}", id, status_id, date);

        // Using MS SQL MERGE statement to perform an UPSERT in a single database call!
        String sql = "MERGE INTO AttendanceLogs AS target " +
                     "USING (VALUES (?, ?, ?)) AS source (UserID, AttendanceDate, StatusID) " +
                     "ON target.UserID = source.UserID AND target.AttendanceDate = source.AttendanceDate " +
                     "WHEN MATCHED THEN " +
                     "    UPDATE SET StatusID = source.StatusID " +
                     "WHEN NOT MATCHED THEN " +
                     "    INSERT (UserID, AttendanceDate, StatusID) VALUES (source.UserID, source.AttendanceDate, source.StatusID);";

        try(Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.setObject(2, date);
            ps.setInt(3, status_id);
            int rowsAffected = ps.executeUpdate();
            logger.info("rows Affected: {}", rowsAffected);
            return rowsAffected > 0;
        } catch(SQLException e) {
            logger.error("Database error inserting attendance", e);
            throw new RuntimeException("Error marking attendance", e);
        }
    }

    @Override
    public List<DailyAttendanceDTO> getAttendanceStatuses(LocalDate date) {
        List<DailyAttendanceDTO> attendances = new ArrayList<>();
        String sql = "SELECT e.id, e.name, e.position, e.dateOfBirth, e.dateOfJoining, e.aadharNumber, e.ESINo, e.esiContribution, a.StatusID " +
                "FROM employee e " +
                "INNER JOIN AttendanceLogs a ON e.id = a.UserID " +
                "WHERE a.AttendanceDate = ?";

        try(Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setObject(1, date);
            try (ResultSet rs = ps.executeQuery()) {
                while(rs.next()) {
                    DailyAttendanceDTO attendance = new DailyAttendanceDTO();
                    attendance.setDate(Date.valueOf(date));
                    Employee emp = EmployeeMapper.mapEmployee(rs);
                    attendance.setEmployee(emp);
                    attendance.setAttendance_Status(rs.getInt("StatusID"));
                    attendances.add(attendance);
                }
                return attendances;
            }catch (SQLException e){
                throw new RuntimeException("Error fetching attendance statuses");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error establishing connection", e);
        }
    }

    public List<DailyAttendanceDTO> getAttendanceByUser(int id) {
        List<DailyAttendanceDTO> list = new ArrayList<>();
        String sql = "SELECT e.id, e.name, e.position, e.dateOfBirth, e.dateOfJoining, e.aadharNumber, e.ESINo, e.esiContribution, a.StatusID, a.AttendanceDate " +
                "FROM employee e " +
                "INNER JOIN AttendanceLogs a ON e.id = a.UserID " +
                "WHERE e.id = ?";

        try(Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            while(rs.next()) {
                DailyAttendanceDTO attendance = new DailyAttendanceDTO();
                Employee emp = EmployeeMapper.mapEmployee(rs);
                attendance.setDate(rs.getDate("AttendanceDate"));
                attendance.setAttendance_Status(rs.getInt("StatusID"));
                attendance.setEmployee(emp);
                list.add(attendance);
            }
            return list;
        } catch (SQLException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public boolean createSalaryById(int id, int salary) throws SQLException{
        String sql = "UPDATE employees SET salary = ? WHERE id=?";

        try(Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, salary);
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch(SQLException e) {
            throw new SQLException("Error when connecting to database. Operation failed for ID: " + id);
        }

    }


}