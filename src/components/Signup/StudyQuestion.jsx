import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form, Modal, Spinner } from 'react-bootstrap';
import '../../css/main.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicExtended from 'ckeditor5-build-classic-extended';
import { useParams } from 'react-router-dom';

const StudyQuestion = ({ data, setData }, props) => {
    const [modalShow, setModalShow] = useState(false);
    const [noofQuestion, setnoofQuestion] = useState(1);

    const [questionIndex, setQuestionIndex] = useState(0);
    const [newState, setStatus] = useState(false);
    const [deletedQ, setDeletedQ] = useState();
    const [questionAdded, setQuestionAdded] = useState(false);
    const [questionValues, setQuestionValues] = useState([]);

    let { id } = useParams();
    useEffect(() => {
        if (questionAdded === true) addField();
    }, [questionAdded]);

    const setEditData = () => {
        // setQuestionValues(data?.map((val) => val));
        setQuestionValues(data.map((val, i) => ({ ...val, id: i + 1 })));
    };
    useEffect(() => {
        if (!id) {
            setQuestionValues([
                {
                    question: '',
                    answer: '',
                    id: 1,
                    files: []
                },
                {
                    question: '',
                    answer: '',
                    id: 2,
                    files: []
                }
            ]);
        }
    }, []);
    useEffect(() => {
        if (data?.length) {
            setEditData();
        }
    }, [data]);

    const handleChange = (val, id, type) => {
        setDeletedQ();
        const questions = questionValues.map((q) => {
            if (q.id == id) {
                q[type] = val;
                return q;
            }
            return q;
        });
        setQuestionValues(questions);
        setData({ ...data, questions: questions });
    };

    const addField = () => {
        setDeletedQ();

        const questions = [...questionValues];
        if (questions.length === 0 || null || undefined) {
            questions.push({
                question: '',
                answer: '',
                id: 1,
                files: []
            });
            setnoofQuestion(questions.length);
        } else {
            for (let i = 1; i <= noofQuestion; i++) {
                questions.push({
                    question: '',
                    answer: '',
                    id: questionValues.length + 1,
                    files: []
                });
            }
        }
        setQuestionValues(questions);
    };

    const setDeletedQNMedia = (id, i) => {
        console.log(id, i, 'sxsxsxscd');
        const questions = [...questionValues];
        questions.map((question) => {
            if (question.id == id) {
                question.files.splice(i, 1);
            }
            return question;
        });
        addField();
        setQuestionValues(questions);
    };

    const deleteField = (id) => {
        setQuestionIndex(0);
        setQuestionValues(questionValues.filter((q) => q.id !== id));
        setData(questionValues.filter((q) => q.id !== id));
    };
    useEffect(() => {
        if (deletedQ) {
            const question = questionValues.find((q) => q.id == deletedQ);
            if (question) {
                deleteField(deletedQ);
            }
            setDeletedQ();
        }
    }, [deletedQ, questionValues]);

    const EditerField = (index) => {
        setModalShow(true);
        setQuestionIndex(index);
    };

    const CloseModal = () => {
        setModalShow(false);
        setStatus(!newState);
        setQuestionIndex(questionIndex);
    };

    const tobackquestion = () => {
        if (questionIndex <= 0) {
            setQuestionIndex(0);
        } else {
            setQuestionIndex(questionIndex - 1);
        }
    };
    const tonextquestion = () => {
        if (questionIndex > noofQuestion) {
            setQuestionIndex(questionIndex);
        } else {
            setQuestionIndex(questionIndex + 1);
        }
    };

    const handleClose = () => setModalShow(false);
    return (
        <>
            <Form noValidate>
                <div>
                    {questionValues?.map((field, index) => (
                        <Row className="question-row question-classic" key={index}>
                            <Col sm={1} className=" text-end">
                                <p className="text-white qindexs">{index + 1}</p>
                            </Col>
                            <Col sm={10} md={5} className="questionblock questnss">
                                <Form.Group>
                                    <CKEditor
                                        id="myediter"
                                        editor={ClassicExtended}
                                        data={field?.question}
                                        onReady={(editor) => {
                                            if (index == questionValues.length - 1) {
                                                setQuestionAdded(false);
                                            }
                                        }}
                                        config={{
                                            placeholder: 'Question',
                                            toolbar: ['bold', 'italic', 'underline', 'numberedList', 'bulletedList', '|', 'link', 'blockQuote', 'mediaEmbed']
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            handleChange(data, field.id, 'question');
                                        }}
                                    />
                                    <div className="d-flex up-media">
                                        {field.files?.map((file, i) => {
                                            if (file.type?.includes('image')) {
                                                return (
                                                    <p className="position-relative up-media" key={i}>
                                                        <img src={URL.createObjectURL(file)} height="50" width="50" />
                                                        <span onClick={() => setDeletedQNMedia(field.id, i)}>x</span>
                                                    </p>
                                                );
                                            } else if (file.type?.includes('video')) {
                                                return (
                                                    <p className="position-relative up-media" key={i}>
                                                        <video style={{ maxWidth: '110px' }} playsInline loop muted controls alt="All the devices" src={URL.createObjectURL(file)} />
                                                        <span onClick={() => setDeletedQNMedia(field.id, i)}>x</span>
                                                    </p>
                                                );
                                            }
                                        })}
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col sm={10} md={5}>
                                <Form.Group>
                                    <Form.Control
                                        value={field?.answer}
                                        onChange={(event) => {
                                            handleChange(event.target.value, field.id, 'answer');
                                        }}
                                        placeholder="Answer"
                                        as="textarea"
                                        rows={10}
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={1} className="">
                                <img src="../assets/trash.svg" className="d-block questn-icons cursor-pointer" onClick={() => setDeletedQ(field.id)} />
                                <img src="../assets/maximize.svg" className="d-block questn-icons mt-2 cursor-pointer" onClick={() => EditerField(index)} />
                            </Col>
                        </Row>
                    ))}

                    <Row className="mb-3">
                        <div className="text-center mt-5">
                            <Form.Group className="mb-3 d-flex align-items-center justify-content-center" controlId="">
                                <Button
                                    className="addquestion me-2"
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setQuestionAdded(true);
                                    }}
                                >
                                    {questionAdded ? <Spinner animation="border" variant="light" /> : '+'} ADD QUESTION
                                </Button>
                                <Form.Select style={{ maxWidth: '80px' }} className=" noofquestions" onChange={(e) => setnoofQuestion(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </Row>
                </div>
            </Form>

            <Modal show={modalShow} size="lg" aria-labelledby="contained-modal-title-vcenter" className="questionmodells" onHide={handleClose} centered>
                <Modal.Header className="questnheader">
                    <Button onClick={CloseModal}>Exit Fullscreen</Button>
                </Modal.Header>
                <Modal.Body className=".gradesmodelbody">
                    <Container className="gradesmodelbox">
                        <Row className=" question-row p-4">
                            <Col sm={10} md={6} className="questionblock position-relative">
                                <>
                                    <Form.Group className="mb-3" controlId="file">
                                        <Form.Label for="file" className="customfile">
                                            <img src="../assets/gallery.png" alt="" />
                                        </Form.Label>
                                        <Form.Control
                                            style={{ display: 'none' }}
                                            type="file"
                                            required
                                            multiple
                                            name="file"
                                            accept="image/png, image/jpeg,image/jpg,image/svg,video/*,audio/*"
                                            onChange={(e) => {
                                                const fileNames = Object.keys(e.target.files);
                                                if (fileNames.find((file) => !['image', 'video', 'audio'].includes(e.target.files[file].type.split('/')[0]))) {
                                                    alert('File Type not Supported!');
                                                    handleClose();
                                                } else if (fileNames.find((file) => e.target.files[file].size > 10000000)) {
                                                    alert('File is too big!\nMax File Size 10mb');
                                                    handleClose();
                                                } else questionValues[questionIndex].files = [...questionValues[questionIndex].files, ...e.target.files];
                                            }}
                                        />
                                    </Form.Group>
                                    <CKEditor
                                        editor={ClassicExtended}
                                        data={questionValues[questionIndex]?.question}
                                        onReady={(editor) => {}}
                                        config={{
                                            placeholder: 'Question',
                                            toolbar: ['bold', 'italic', 'underline', '|', 'alignment', '|', 'numberedList', 'bulletedList', '|', 'link', '|', 'redo']
                                        }}
                                        onBlur={(event, editor) => {}}
                                        onFocus={(event, editor) => {}}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            const questions = [...questionValues];
                                            questions[questionIndex]['question'] = data;
                                            setQuestionValues(questions);
                                        }}
                                    />
                                    {questionValues[questionIndex]?.files?.map((file) => {
                                        if (file.type?.includes('image')) {
                                            return <img src={URL.createObjectURL(file)} height="40" width="40" />;
                                        } else if (file.type?.includes('video')) {
                                            return <video style={{ maxWidth: '30%' }} playsInline loop muted controls alt="All the devices" src={URL.createObjectURL(file)} />;
                                        }
                                    })}
                                </>
                            </Col>
                            <Col sm={10} md={6}>
                                <Form.Control
                                    id="file"
                                    className="answerinModal"
                                    value={questionValues[questionIndex]?.answer}
                                    onChange={(event) => {
                                        const data = event.target.value;
                                        const questions = [...questionValues];
                                        questions[questionIndex]['answer'] = data;
                                        setQuestionValues(questions);
                                    }}
                                    placeholder="Answer"
                                    as="textarea"
                                    rows={15}
                                />
                            </Col>
                        </Row>
                        <p className="prev">
                            <img src="../assets/w-left.svg" alt="" onClick={() => tobackquestion()} />
                        </p>
                        <p className="next">
                            <img src="../assets/w-right.svg" alt="" onClick={() => tonextquestion()} />
                        </p>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default StudyQuestion;
