import React, { useState, useRef } from 'react';
import { Container, Button, Table, Form } from 'react-bootstrap';
import '../../../css/main.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Footer from '../../../Layouts/Footer';
import { Circle } from 'rc-progress';
import { useEffect } from 'react';
// import CourseDrags from './CourseDrags';
const Grades1 = [];
const Grades2 = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'D', 'D', 'F'];
const Semester = ({ setGPA, setScale }) => {
    const dragItem = useRef();
    const coursname = useRef();
    const dragOverItem = useRef();

    const fGrade1 = {
        'A+': 13,
        A: 12,
        'A-': 11,
        'B+': 10,
        B: 9,
        'B-': 8,
        'C+': 7,
        C: 6,
        'C-': 5,
        D: 4,
        D: 3,
        D: 2,
        F: 1
    };
    const fGrade2 = {
        A: 12,
        'A-': 11,
        'B+': 10,
        B: 9,
        'B-': 8,
        'C+': 7,
        C: 6,
        'C-': 5,
        D: 4,
        D: 3,
        D: 2,
        F: 1
    };

    const dragStart = (e, position) => {
        dragItem.current = position;
        document.getElementsByClassName('drg').style.cursor = 'move';
    };
    const dragEnter = (e, position) => {
        e.preventDefault();
        dragOverItem.current = position;
        document.getElementsByClassName('drg').style.cursor = 'move';
    };
    const drop = (id, e) => {
        semesters
            .filter((value) => id === value.id)
            .map((val) => {
                const copyListItems = val.courses;
                const dragItemContent = copyListItems[dragItem.current];
                copyListItems.splice(dragItem.current, 1);
                copyListItems.splice(dragOverItem.current, 0, dragItemContent);
                dragItem.current = null;
                dragOverItem.current = null;
                setCheck(!check);
            });
    };

    const [courseValue, setCourseValue] = useState('');
    const [grades, setGrades] = useState(Grades2);

    const [check, setCheck] = useState(true);
    const [percentage, setPercentage] = useState();

    const [semesters, setSemesters] = useState([
        {
            id: 1,
            name: 'Semester',
            courses: [
                { id: 1, name: 'Computer Science 1', credit: 4, grade: 'A', objgrade: 'B', colorClass: 'Aclass' },
                { id: 2, name: 'Computer Science 2', credit: 4, grade: 'A', objgrade: 'B', colorClass: 'Aclass' },
                { id: 3, name: 'Computer Science 3', credit: 4, grade: 'A', objgrade: 'B', colorClass: 'Aclass' },
                { id: 4, name: 'Computer Science 4', credit: 4, grade: 'C', objgrade: 'A', colorClass: 'Fclass' }
            ]
        }
    ]);

    const handleChange = (value, semesterId, courseId, type, e) => {
        const updatedSemesters = semesters.map((semester) => {
            if (semester.id == semesterId) {
                semester.courses.map((course) => {
                    if (course.id == courseId) {
                        course[type] = value;
                        course.colorClass = fGrade2[value] >= fGrade2[course.objgrade] ? 'Aclass' : 'Fclass';
                        setPercentage({ ...percentage, [e.target.name]: e.target.value });
                    }
                    return course;
                });
            }
            return semester;
        });

        setSemesters(updatedSemesters);
    };

    const handleChangeObjGrade = (value, semesterId, courseId, type) => {
        const updatedSemesters = semesters.map((semester) => {
            if (semester.id == semesterId) {
                semester.courses.map((course) => {
                    if (course.id == courseId) {
                        course[type] = value;
                        course.colorClass = fGrade2[value] <= fGrade2[course.grade] ? 'Aclass' : 'Fclass';
                    }

                    return course;
                });
            }
            return semester;
        });
        setSemesters(updatedSemesters);
    };
    let gradingSet = [];
    const handleGPAScaleChange = (e) => {
        if (e.target.value == '4.3') {
            Object.keys(fGrade1).forEach(function (key) {
                gradingSet.push(key);
                setGrades(gradingSet);
            });
        } else {
            Object.keys(fGrade2).forEach(function (key) {
                gradingSet.push(key);
                setGrades(gradingSet);
            });
        }
        setScale(e.target.value);
    };

    const addNewCourse = (id, ev = null, semester) => {
        const courseName = courseValue || ev.target.value || null;
        if (!courseName) {
            alert('Plz Add Course Name');
            return;
        }
        semesters
            .filter((value) => id === value.id)
            .map((val) => {
                val.courses.push({ id: semester.courses.length + 1, name: courseName, credit: 4, grade: 'A', objgrade: 'B' });
                setCheck(!check);
            });
        coursname.current.value = '';
        setCourseValue('');
    };
    const handleAddition = (ev, id, semester) => {
        {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                addNewCourse(id, ev, semester);
            }
        }
    };
    const handleAdditionSem = () => {
        let addSemester = {
            id: semesters.length + 1,
            name: 'Semester' + ' ' + (semesters.length + 1),
            courses: [{ id: 1, name: 'Computer Scienc 1', credit: 3, grade: 'A', objgrade: 'B' }]
        };

        setSemesters([...semesters, addSemester]);
    };
    const handleChangeCourse = (e, cid, sid) => {
        const filteredSemestersName = semesters.map((semester) => {
            if (semester.id == sid) {
                semester.courses.map((course) => {
                    if (course.id == cid) course.name = e.target.value;
                });
            }
            return semester;
        });
        setSemesters(filteredSemestersName);
    };
    const delCourse = (cid, sid) => {
        const filteredSemesters = semesters.map((semester) => {
            if (semester.id == sid) {
                const filteredCourses = semester.courses?.filter((course) => course.id !== cid);
                semester.courses = filteredCourses;
            }
            return semester;
        });
        setSemesters(filteredSemesters);
    };
    const delSemester = (sid) => {
        setSemesters(semesters?.filter((sem) => sem.id !== sid));
    };
    useEffect(() => {
        let totalSum = 0;

        for (let semester of semesters) {
            totalSum += getGradeValue(semester);
        }

        setGPA(totalSum / semesters?.length);
    }, [semesters]);

    const getGradeValue = (semester) => {
        let sum = 0;
        let totalCreditHours = 0;
        for (let course of semester?.courses) {
            switch (course.grade) {
                case 'A+':
                    sum = sum + 4.3 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'A':
                    sum = sum + 4.0 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'A-':
                    sum = sum + 3.7 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'B+':
                    sum = sum + 3.3 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'B':
                    sum = sum + 3 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'B-':
                    sum = sum + 2.7 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'C+':
                    sum = sum + 2.3 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'C':
                    sum = sum + 2 * course.credit;
                    totalCreditHours += course.credit;
                    break;
                case 'C-':
                    sum = sum + 1.7 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'D+':
                    sum = sum + 1.3 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'D':
                    sum = sum + 1 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'D-':
                    sum = sum + 0.7 * course.credit;
                    totalCreditHours += course.credit;
                    break;

                case 'F':
                    sum = sum + 0 * course.credit;
                    totalCreditHours += course.credit;
                    break;
            }
        }

        return sum / totalCreditHours;
    };

    return (
        <>
            <div className="semester-credit py-5">
                <Container className="semester-table">
                    <div className="mb-4">
                        <div className="text-end d-flex justify-content-end" style={{ marginTop: '-40px' }}>
                            <Form.Select className="form-control form-select private" style={{ backgroundColor: 'transparent' }} onChange={(e) => handleGPAScaleChange(e)} size="lg">
                                <option value="4.0">4.0 Scale</option>
                                <option value="4.3">4.3 Scale</option>
                            </Form.Select>
                        </div>
                    </div>
                    {semesters?.map((semester, index) => {
                        return (
                            <Table size="sm" key={index} className="ps-2">
                                <thead>
                                    <tr>
                                        <th className="yersm">Year & Semester</th>
                                        <div className="course-th">
                                            <th className="ps-3">Course Name</th>
                                            <th className="ps-3">Credits</th>
                                            <th>Final Grade</th>
                                            <th>Objective Grade</th>
                                        </div>
                                    </tr>
                                </thead>
                                <tbody>
                                    <>
                                        <tr>
                                            <td className="semtd">
                                                <span className="semdel">
                                                    <img src="../assets/trash.svg" alt="del" onClick={() => delSemester(semester.id)} />
                                                </span>
                                                {semester.name}
                                            </td>
                                            {semester?.courses?.map((course, index) => {
                                                return (
                                                    <>
                                                        <div className="course-td ps-3 drg" key={index} draggable={true}>
                                                            <td draggable>
                                                                <span className="coursedel">
                                                                    <img src="../assets/trash.svg" alt="del" onClick={() => delCourse(course.id, semester.id)} />
                                                                </span>
                                                                <div
                                                                    className="drags-lists"
                                                                    onDragStart={(e) => dragStart(e, index)}
                                                                    onDragEnter={(e) => dragEnter(e, index)}
                                                                    onDragEnd={() => drop(semester.id)}
                                                                    key={index}
                                                                    draggable={true}
                                                                >
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="coursename"
                                                                        value={course.name}
                                                                        onChange={(e) => handleChangeCourse(e, course.id, semester.id)}
                                                                        className="resfield"
                                                                        placeholder="Add Course"
                                                                    />
                                                                    {/* <span>{course.name}</span> */}
                                                                </div>
                                                            </td>
                                                            <td className="sml-btn ps-3">
                                                                <input
                                                                    type="number"
                                                                    className="credits-input"
                                                                    placeholder="4"
                                                                    min="1"
                                                                    max="10"
                                                                    defaultValue={course.credit}
                                                                    onChange={(e) => handleChange(parseInt(e.target.value), semester.id, course.id, 'credit')}
                                                                />
                                                                <Button>Add Credit</Button>
                                                            </td>
                                                            <td className="sml-btn">
                                                                <div className="fgrade">
                                                                    <Form.Select
                                                                        aria-label="Default select example"
                                                                        onChange={(e) => handleChange(e.target.value, semester.id, course.id, 'grade')}
                                                                        className="text-white"
                                                                        value={course.grade}
                                                                    >
                                                                        {grades?.map((val, i) => {
                                                                            return (
                                                                                <option key={i} value={val}>
                                                                                    {val}
                                                                                </option>
                                                                            );
                                                                        })}
                                                                    </Form.Select>
                                                                    <Button>Add Grade</Button>
                                                                </div>
                                                            </td>
                                                            <td className="sml-btn">
                                                                <div className="fgrade">
                                                                    <Form.Select
                                                                        aria-label="Default select example"
                                                                        onChange={(e) => {
                                                                            // handleChange(e.target.value, semester.id, course.id, 'objgrade')
                                                                            handleChangeObjGrade(e.target.value, semester.id, course.id, 'objgrade');
                                                                        }}
                                                                        className={course.colorClass || 'Cclass'}
                                                                        value={course.objgrade}
                                                                    >
                                                                        {grades.map((val, i) => {
                                                                            return (
                                                                                <option key={i} value={val}>
                                                                                    {val}
                                                                                </option>
                                                                            );
                                                                        })}
                                                                    </Form.Select>
                                                                    <Button>Add Grade</Button>
                                                                </div>
                                                            </td>
                                                        </div>
                                                        {/* s<Button onClick={() => delCourse(course.id, semester.id)}>Delete {course.id}</Button> */}
                                                    </>
                                                );
                                            })}
                                            <div style={{ margin: '10px' }}>
                                                <span>
                                                    <img src="../assets/plus-c.svg" alt="plus-add" className="pluss-palner" onClick={(ev) => addNewCourse(semester.id, ev)} />

                                                    <Form.Control
                                                        type="text"
                                                        ref={coursname}
                                                        onChange={(ev) => setCourseValue(ev.target.value)}
                                                        name="tezt"
                                                        onKeyPress={(ev) => handleAddition(ev, semester.id, semester)}
                                                        defaultValue=""
                                                        className="resfield academic"
                                                        placeholder="Add Course"
                                                    />
                                                </span>
                                            </div>
                                        </tr>
                                    </>

                                    <tr className="border-tr mb-3"></tr>
                                </tbody>
                            </Table>
                        );
                    })}
                    <hr className="hrrow" />
                    <p>
                        <span onClick={handleAdditionSem}>
                            <img src="../assets/plus-c.svg" alt="plus-add" className="pluss-palner" />
                            <Form.Control type="text" name="tezt" disabled value="Add Semester" className="resfield sem academic" placeholder=" Add Semester" />
                        </span>
                    </p>
                </Container>
                <br />
                <br />
                <Footer />
            </div>
        </>
    );
};

export default Semester;
