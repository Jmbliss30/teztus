import React, { useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import '../../css/main.css';

const ResTezt = () => {
    const [tezt, setTezt] = useState([
        {
            id: 1,
            icons: '',
            name: ''
        },
        {
            id: 2,
            icons: '',
            name: ''
        },
        {
            id: 3,
            icons: ''
        },
        {
            id: 4,
            icons: '',
            name: ''
        }
    ]);

    return (
        <>
            <div className="Tezts mt-4">
                <Container>
                    <div className="mt-4">
                        <Row>
                            {tezt.map((val, index) => {
                                return (
                                    <Col xs={6} md={3} className="my-3 docmenttt p-4 resr" key={val.id}>
                                        <div>
                                            <p>
                                                <img src="../assets/22.png" alt="puzle" className="rounded-pill p-3" width="100%" />
                                            </p>
                                            <p className="tezt-center">Tezt</p>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default ResTezt;
