import React, { useEffect } from 'react';
import SubjectsMain from '../components/subjects/SubjectMain';
import { Container } from 'react-bootstrap';
import Header from '../Layouts/Header';
import UserActivity from '../components/subjects/UserActivity';
// import Footer from '../Layouts/Footer';
// import ReactFullpage from '@fullpage/react-fullpage';
import { useNavigate } from 'react-router-dom';
import Callender from '../components/Planner/Main/Calender';
import GpaBlock from '../components/Planner/Main/GPABlock';
import Semester from '../components/Planner/Main/Semester';
import { useState } from 'react';
import { getLoggedUser } from '../helpers/utils';
import axios from 'axios';

const Subjects = () => {
    const user = getLoggedUser();
    const [gpa, setGPA] = useState(0.0);
    const [scale, setScale] = useState('4.0');
    const navigate = useNavigate();

    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUserId = async (email) => {
            try {
                const url = `${process.env.REACT_APP_BASE_URL}/api/users/email/` + email;
                const id = await axios.get(url);
                setUserId(id.data);
            } catch (err) {
                console.log(err);
            }
        };
        if (user !== undefined) {
            fetchUserId(user.email);
        }
    }, [user]);

    return (
        <>
            <div>
                <div className="Header Home user-analyti" id="main-header">
                    <Container>
                        <Header userId={userId} />
                    </Container>
                </div>

                <UserActivity userId={userId} />
                <SubjectsMain userId={userId} />

                {/* <Callender /> */}
                <div className="position-relative">
                    <GpaBlock gpa={gpa} scale={scale} />
                    <Semester setGPA={setGPA} gpa={gpa} setScale={setScale} />
                </div>

                {/* Intro Video  */}

                {/* <IntroVideo show={modalShow} onHide={() => setModalShow(false)} /> */}

                {/* <Deadline /> */}
            </div>
        </>
    );
};

export default Subjects;
