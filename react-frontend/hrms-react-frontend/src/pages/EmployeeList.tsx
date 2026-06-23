import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, Eye, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeApi } from '../services/api';
import type { Employee } from '../types/types';
import PageTransition from '../components/ui/PageTransition';
import { PositionBadge } from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import './EmployeeList.css';

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    position: '',
    dateOfBirth: '',
    dateOfJoining: '',
    aadharNumber: '',
    esiNo: '',
    esiContribution: '',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await employeeApi.delete(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.success(`${name} removed successfully`);
    } catch {
      toast.error('Failed to delete employee');
    }
  }

  async function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmployee.id || !newEmployee.name || !newEmployee.position) {
      toast.error('ID, Name, and Position are required');
      return;
    }

    try {
      await employeeApi.create({
        id: Number(newEmployee.id),
        name: newEmployee.name,
        position: newEmployee.position,
        dateOfBirth: newEmployee.dateOfBirth || null,
        dateOfJoining: newEmployee.dateOfJoining || null,
        aadharNumber: newEmployee.aadharNumber || null,
        esiNo: newEmployee.esiNo || null,
        esiContribution: Number(newEmployee.esiContribution) || 0,
      });
      toast.success(`${newEmployee.name} added successfully`);
      setShowAddModal(false);
      setNewEmployee({
        id: '', name: '', position: '', dateOfBirth: '',
        dateOfJoining: '', aadharNumber: '', esiNo: '', esiContribution: '',
      });
      loadEmployees();
    } catch {
      toast.error('Failed to add employee');
    }
  }

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()) ||
      String(e.id).includes(search),
  );

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

  return (
    <PageTransition>
      <div className="page" id="employee-list-page">
        <div className="page-header">
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your organization's workforce</p>
        </div>

        {/* Actions bar */}
        <div className="employee-list-header">
          <div className="search-bar" style={{ maxWidth: 360, flex: 1 }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, position, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="employee-search"
            />
          </div>
          <div className="employee-list-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
              id="add-employee-btn"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton rows={8} />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <UserPlus />
            <h3>No employees found</h3>
            <p>{search ? 'Try a different search term' : 'Add your first employee to get started'}</p>
          </div>
        ) : (
          <motion.div
            className="table-container card"
            style={{ padding: 0 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Position</th>
                  <th>Date of Joining</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <motion.tr
                    key={emp.id}
                    className="employee-table-row"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.25 }}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <td>
                      <div className="employee-table-name">
                        <div className="avatar avatar-sm">{getInitials(emp.name)}</div>
                        <span className="employee-table-name-text">{emp.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="employee-table-id">#{emp.id}</span>
                    </td>
                    <td>
                      <PositionBadge position={emp.position} />
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                      {emp.dateOfJoining || '—'}
                    </td>
                    <td>
                      <div className="employee-table-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-ghost btn-icon"
                          title="View profile"
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          id={`view-emp-${emp.id}`}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon"
                          title="Delete"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          id={`delete-emp-${emp.id}`}
                          style={{ color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Add Employee Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Employee"
          width="560px"
        >
          <form className="add-employee-form" onSubmit={handleAddEmployee} id="add-employee-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Employee ID *</label>
                <input
                  type="number"
                  placeholder="e.g. 121"
                  value={newEmployee.id}
                  onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                  required
                  id="input-emp-id"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  required
                  id="input-emp-name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Position *</label>
                <select
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  required
                  id="input-emp-position"
                >
                  <option value="">Select position</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Technical Lead">Technical Lead</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="Manager">Manager</option>
                  <option value="Analyst">Analyst</option>
                  <option value="QA Tester">QA Tester</option>
                  <option value="HR Executive">HR Executive</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Scrum Master">Scrum Master</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  value={newEmployee.dateOfBirth}
                  onChange={(e) => setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })}
                  id="input-emp-dob"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Joining</label>
                <input
                  type="date"
                  value={newEmployee.dateOfJoining}
                  onChange={(e) => setNewEmployee({ ...newEmployee, dateOfJoining: e.target.value })}
                  id="input-emp-doj"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Aadhar Number</label>
                <input
                  type="text"
                  placeholder="16-digit Aadhar"
                  maxLength={16}
                  value={newEmployee.aadharNumber}
                  onChange={(e) => setNewEmployee({ ...newEmployee, aadharNumber: e.target.value })}
                  id="input-emp-aadhar"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ESI Number</label>
                <input
                  type="text"
                  placeholder="ESI No."
                  value={newEmployee.esiNo}
                  onChange={(e) => setNewEmployee({ ...newEmployee, esiNo: e.target.value })}
                  id="input-emp-esi"
                />
              </div>
              <div className="form-group">
                <label className="form-label">ESI Contribution</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newEmployee.esiContribution}
                  onChange={(e) => setNewEmployee({ ...newEmployee, esiContribution: e.target.value })}
                  id="input-emp-esi-contrib"
                />
              </div>
            </div>

            <div className="add-employee-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" id="submit-add-employee">
                <Plus size={16} />
                Add Employee
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}
