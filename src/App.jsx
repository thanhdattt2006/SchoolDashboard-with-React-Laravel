import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import './app.css'

export default function App() {
  // Data Storage
  const [students, setStudents] = useState([
    { id: 1, name: "Nguyễn Văn An", address: "Hà Nội", phone: "0123456789", dob: "2001-05-15" },
    { id: 2, name: "Trần Thị Bình", address: "Hồ Chí Minh", phone: "0987654321", dob: "2002-08-22" }
  ]);

  const [courses, setCourses] = useState([
    { id: 1, name: "JavaScript Fundamentals", score: 85.5, student_id: 1 },
    { id: 2, name: "React Development", score: 92.0, student_id: 1 },
    { id: 3, name: "Database Design", score: 78.5, student_id: 2 }
  ]);

  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('students');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [studentSearch, setStudentSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    address: '',
    phone: '',
    dob: ''
  });

  const [courseForm, setCourseForm] = useState({
    name: '',
    score: '',
    student_id: ''
  });

  // Initialize
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setTheme(savedTheme);
    setCurrentLanguage(savedLanguage);
    updateLanguage();
  }, []);

  useEffect(() => {
    document.getElementById('body').setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    updateLanguage();
  }, [currentLanguage]);

  // Custom SweetAlert2 theme based on current theme
  const getSweetAlertTheme = () => {
    const isDark = theme === 'dark';
    return {
      background: isDark ? '#2D3748' : '#FFFFFF',
      color: isDark ? '#E2E8F0' : '#2D3748',
      confirmButtonColor: '#4299E1',
      cancelButtonColor: '#A0AEC0'
    };
  };

  // Override Swal.fire to use theme
  const showAlert = (options) => {
    const alertTheme = getSweetAlertTheme();
    return Swal.fire({ ...alertTheme, ...options });
  };

  // Language Translation
  const updateLanguage = () => {
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-en], [data-vi], [data-en-placeholder], [data-vi-placeholder]');
      elements.forEach(element => {
        if (element.hasAttribute('data-' + currentLanguage)) {
          element.textContent = element.getAttribute('data-' + currentLanguage);
        }
        if (element.hasAttribute('data-' + currentLanguage + '-placeholder')) {
          element.placeholder = element.getAttribute('data-' + currentLanguage + '-placeholder');
        }
      });
    }, 0);
  };

  // Statistics calculation
  const totalStudents = students.length;
  const totalCourses = courses.length;
  const averageScore = courses.length > 0 ? 
    (courses.reduce((sum, course) => sum + course.score, 0) / courses.length).toFixed(1) : 0;

  // Filter functions
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.address.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.phone.includes(studentSearch)
  );

  const filteredCourses = courses.filter(course => {
    const student = students.find(s => s.id === course.student_id);
    const studentName = student ? student.name.toLowerCase() : '';
    
    return course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
           studentName.includes(courseSearch.toLowerCase()) ||
           course.score.toString().includes(courseSearch);
  });

  // Student Functions
  const openStudentModal = (studentId = null) => {
    setCurrentStudentId(studentId);
    if (studentId) {
      const student = students.find(s => s.id === studentId);
      setStudentForm({
        name: student.name,
        address: student.address,
        phone: student.phone,
        dob: student.dob
      });
    } else {
      setStudentForm({ name: '', address: '', phone: '', dob: '' });
    }
    setStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setStudentModalOpen(false);
    setCurrentStudentId(null);
    setStudentForm({ name: '', address: '', phone: '', dob: '' });
  };

  const handleStudentSubmit = () => {
    if (currentStudentId) {
      // Update existing student
      setStudents(prev => prev.map(s => 
        s.id === currentStudentId ? { ...s, ...studentForm } : s
      ));
      
      showAlert({
        icon: 'success',
        title: currentLanguage === 'vi' ? 'Thành công!' : 'Success!',
        text: currentLanguage === 'vi' ? 'Sinh viên đã được cập nhật!' : 'Student updated successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      // Add new student
      const newId = Math.max(...students.map(s => s.id), 0) + 1;
      setStudents(prev => [...prev, { id: newId, ...studentForm }]);
      
      showAlert({
        icon: 'success',
        title: currentLanguage === 'vi' ? 'Thành công!' : 'Success!',
        text: currentLanguage === 'vi' ? 'Sinh viên mới đã được thêm!' : 'New student added successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    }

    closeStudentModal();
  };

  const editStudent = (id) => {
    openStudentModal(id);
  };

  const deleteStudent = (id) => {
    showAlert({
      title: currentLanguage === 'vi' ? 'Xác nhận xóa' : 'Confirm Delete',
      text: currentLanguage === 'vi' ? 'Bạn có chắc chắn muốn xóa sinh viên này?' : 'Are you sure you want to delete this student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E53E3E',
      cancelButtonColor: '#A0AEC0',
      confirmButtonText: currentLanguage === 'vi' ? 'Xóa' : 'Delete',
      cancelButtonText: currentLanguage === 'vi' ? 'Hủy' : 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setStudents(prev => prev.filter(s => s.id !== id));
        setCourses(prev => prev.filter(c => c.student_id !== id));
        
        showAlert({
          icon: 'success',
          title: currentLanguage === 'vi' ? 'Đã xóa!' : 'Deleted!',
          text: currentLanguage === 'vi' ? 'Sinh viên đã được xóa.' : 'Student has been deleted.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Course Functions
  const openCourseModal = (courseId = null) => {
    setCurrentCourseId(courseId);
    if (courseId) {
      const course = courses.find(c => c.id === courseId);
      setCourseForm({
        name: course.name,
        score: course.score,
        student_id: course.student_id
      });
    } else {
      setCourseForm({ name: '', score: '', student_id: '' });
    }
    setCourseModalOpen(true);
  };

  const closeCourseModal = () => {
    setCourseModalOpen(false);
    setCurrentCourseId(null);
    setCourseForm({ name: '', score: '', student_id: '' });
  };

  const handleCourseSubmit = () => {
    const formData = {
      name: courseForm.name,
      score: parseFloat(courseForm.score),
      student_id: parseInt(courseForm.student_id)
    };

    if (currentCourseId) {
      // Update existing course
      setCourses(prev => prev.map(c => 
        c.id === currentCourseId ? { ...c, ...formData } : c
      ));
      
      showAlert({
        icon: 'success',
        title: currentLanguage === 'vi' ? 'Thành công!' : 'Success!',
        text: currentLanguage === 'vi' ? 'Khóa học đã được cập nhật!' : 'Course updated successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      // Add new course
      const newId = Math.max(...courses.map(c => c.id), 0) + 1;
      setCourses(prev => [...prev, { id: newId, ...formData }]);
      
      showAlert({
        icon: 'success',
        title: currentLanguage === 'vi' ? 'Thành công!' : 'Success!',
        text: currentLanguage === 'vi' ? 'Khóa học mới đã được thêm!' : 'New course added successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    }

    closeCourseModal();
  };

  const editCourse = (id) => {
    openCourseModal(id);
  };

  const deleteCourse = (id) => {
    showAlert({
      title: currentLanguage === 'vi' ? 'Xác nhận xóa' : 'Confirm Delete',
      text: currentLanguage === 'vi' ? 'Bạn có chắc chắn muốn xóa khóa học này?' : 'Are you sure you want to delete this course?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E53E3E',
      cancelButtonColor: '#A0AEC0',
      confirmButtonText: currentLanguage === 'vi' ? 'Xóa' : 'Delete',
      cancelButtonText: currentLanguage === 'vi' ? 'Hủy' : 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setCourses(prev => prev.filter(c => c.id !== id));
        
        showAlert({
          icon: 'success',
          title: currentLanguage === 'vi' ? 'Đã xóa!' : 'Deleted!',
          text: currentLanguage === 'vi' ? 'Khóa học đã được xóa.' : 'Course has been deleted.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Settings functions
  const handleThemeToggle = (checked) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeStudentModal();
        closeCourseModal();
        setSettingsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div id="body" data-theme={theme}>
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-graduation-cap"></i>
              <span data-en="EduManager" data-vi="Quản Lý Giáo Dục">EduManager</span>
            </div>
            <div className="header-actions">
              <span data-en="Welcome, Admin" data-vi="Chào mừng, Admin">Welcome, Admin</span>
            </div>
          </div>
        </header>

        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ color: "var(--accent-primary)" }}>
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-number" id="totalStudents">{totalStudents}</div>
              <div className="stat-label" data-en="Total Students" data-vi="Tổng Sinh Viên">Total Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ color: "var(--accent-success)" }}>
                <i className="fas fa-book"></i>
              </div>
              <div className="stat-number" id="totalCourses">{totalCourses}</div>
              <div className="stat-label" data-en="Total Courses" data-vi="Tổng Khóa Học">Total Courses</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ color: "var(--accent-warning)" }}>
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-number" id="averageScore">{averageScore}</div>
              <div className="stat-label" data-en="Average Score" data-vi="Điểm Trung Bình">Average Score</div>
            </div>
          </div>

          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`} 
              onClick={() => setActiveTab('students')}
            >
              <i className="fas fa-users"></i>
              <span data-en="Students" data-vi="Sinh Viên">Students</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <i className="fas fa-book"></i>
              <span data-en="Courses" data-vi="Khóa Học">Courses</span>
            </button>
          </div>

          <div id="students" className={`tab-content ${activeTab === 'students' ? 'active' : ''}`}>
            <div className="action-bar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  id="studentSearch" 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  data-en-placeholder="Search students..." 
                  data-vi-placeholder="Tìm kiếm sinh viên..."
                  placeholder="Search students..."
                />
              </div>
              <button className="btn btn-primary" onClick={() => openStudentModal()}>
                <i className="fas fa-plus"></i>
                <span data-en="Add Student" data-vi="Thêm Sinh Viên">Add Student</span>
              </button>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th data-en="ID" data-vi="Mã">ID</th>
                    <th data-en="Name" data-vi="Tên">Name</th>
                    <th data-en="Address" data-vi="Địa Chỉ">Address</th>
                    <th data-en="Phone" data-vi="Điện Thoại">Phone</th>
                    <th data-en="Date of Birth" data-vi="Ngày Sinh">Date of Birth</th>
                    <th data-en="Actions" data-vi="Thao Tác">Actions</th>
                  </tr>
                </thead>
                <tbody id="studentsTableBody">
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.address}</td>
                      <td>{student.phone}</td>
                      <td>{new Date(student.dob).toLocaleDateString()}</td>
                      <td className="actions">
                        <button className="btn btn-sm btn-warning" onClick={() => editStudent(student.id)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteStudent(student.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="courses" className={`tab-content ${activeTab === 'courses' ? 'active' : ''}`}>
            <div className="action-bar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  id="courseSearch" 
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  data-en-placeholder="Search courses..." 
                  data-vi-placeholder="Tìm kiếm khóa học..."
                  placeholder="Search courses..."
                />
              </div>
              <button className="btn btn-primary" onClick={() => openCourseModal()}>
                <i className="fas fa-plus"></i>
                <span data-en="Add Course" data-vi="Thêm Khóa Học">Add Course</span>
              </button>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th data-en="ID" data-vi="Mã">ID</th>
                    <th data-en="Course Name" data-vi="Tên Khóa Học">Course Name</th>
                    <th data-en="Score" data-vi="Điểm">Score</th>
                    <th data-en="Student" data-vi="Sinh Viên">Student</th>
                    <th data-en="Actions" data-vi="Thao Tác">Actions</th>
                  </tr>
                </thead>
                <tbody id="coursesTableBody">
                  {filteredCourses.map(course => {
                    const student = students.find(s => s.id === course.student_id);
                    const studentName = student ? student.name : 'Unknown Student';
                    
                    return (
                      <tr key={course.id}>
                        <td>{course.id}</td>
                        <td>{course.name}</td>
                        <td>{course.score}</td>
                        <td>{studentName}</td>
                        <td className="actions">
                          <button className="btn btn-sm btn-warning" onClick={() => editCourse(course.id)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteCourse(course.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <button className="settings-btn" onClick={() => setSettingsOpen(true)}>
          <i className="fas fa-cog"></i>
        </button>

        {settingsOpen && (
          <>
            <div className="settings-overlay" onClick={() => setSettingsOpen(false)}></div>
            <div className="settings-panel active">
              <div className="settings-header">
                <h3 data-en="Settings" data-vi="Cài Đặt">Settings</h3>
                <button className="btn btn-sm" onClick={() => setSettingsOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="settings-section">
                <h4 data-en="Theme" data-vi="Giao Diện">Theme</h4>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={theme === 'dark'}
                    onChange={(e) => handleThemeToggle(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
                <span data-en="Dark Mode" data-vi="Chế Độ Tối">Dark Mode</span>
              </div>

              <div className="settings-section">
                <h4 data-en="Language" data-vi="Ngôn Ngữ">Language</h4>
                <select 
                  className="lang-select" 
                  value={currentLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>
            </div>
          </>
        )}

        {studentModalOpen && (
          <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
              <h3 data-en={currentStudentId ? "Edit Student" : "Add Student"} data-vi={currentStudentId ? "Sửa Sinh Viên" : "Thêm Sinh Viên"}>
                {currentStudentId ? "Edit Student" : "Add Student"}
              </h3>
              <div>
                <div className="form-group">
                  <label data-en="Name" data-vi="Tên">Name</label>
                  <input 
                    type="text" 
                    value={studentForm.name}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label data-en="Address" data-vi="Địa Chỉ">Address</label>
                  <input 
                    type="text" 
                    value={studentForm.address}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label data-en="Phone" data-vi="Điện Thoại">Phone</label>
                  <input 
                    type="tel" 
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label data-en="Date of Birth" data-vi="Ngày Sinh">Date of Birth</label>
                  <input 
                    type="date" 
                    value={studentForm.dob}
                    onChange={(e) => setStudentForm(prev => ({ ...prev, dob: e.target.value }))}
                    required
                  />
                </div>
                <div style={{display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem"}}>
                  <button type="button" className="btn btn-warning" onClick={closeStudentModal}>
                    <span data-en="Cancel" data-vi="Hủy">Cancel</span>
                  </button>
                  <button type="button" className="btn btn-success" onClick={handleStudentSubmit}>
                    <span data-en="Save" data-vi="Lưu">Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {courseModalOpen && (
          <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
              <h3 data-en={currentCourseId ? "Edit Course" : "Add Course"} data-vi={currentCourseId ? "Sửa Khóa Học" : "Thêm Khóa Học"}>
                {currentCourseId ? "Edit Course" : "Add Course"}
              </h3>
              <div>
                <div className="form-group">
                  <label data-en="Course Name" data-vi="Tên Khóa Học">Course Name</label>
                  <input 
                    type="text" 
                    value={courseForm.name}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label data-en="Score" data-vi="Điểm">Score</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.1" 
                    value={courseForm.score}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, score: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label data-en="Student" data-vi="Sinh Viên">Student</label>
                  <select 
                    value={courseForm.student_id}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, student_id: e.target.value }))}
                    required
                  >
                    <option value="" data-en="Select Student" data-vi="Chọn Sinh Viên">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem"}}>
                  <button type="button" className="btn btn-warning" onClick={closeCourseModal}>
                    <span data-en="Cancel" data-vi="Hủy">Cancel</span>
                  </button>
                  <button type="button" className="btn btn-success" onClick={handleCourseSubmit}>
                    <span data-en="Save" data-vi="Lưu">Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}