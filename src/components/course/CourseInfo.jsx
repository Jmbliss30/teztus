import { Button, Row, Col, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import '../../css/main.css';
import { Formik } from 'formik';
import * as yup from 'yup';
import MyDate from '../feed/Date';
import { useEffect } from 'react';
import axios from 'axios';

const CourseInfo = ({ course, userId, courseId, paidCourse }) => {
    const [allReviews, setAllReviews] = useState();
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [rating, setRating] = useState(0);

    // Fetch reviewa
    useEffect(() => {
        if (courseId) {
            fetchReviews();
        }
    }, [courseId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/courseReviews/course/${courseId}`);
            setAllReviews(res.data.reverse());
        } catch (err) {
            console.log(err);
        }
    };

    const handleRating = (rate) => {
        setRating(rate);
    };
    const schema = yup.object().shape({
        text: yup.string()
    });
    const Reviews = () => {
        const handleSubmit = async (values) => {
            const newvalues = { userId: userId, courseId: courseId, ...values, rating: rating };
            try {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/courseReviews`, newvalues);
            } catch (err) {
                console.log(err);
            }
            fetchReviews();
            setShowWriteReview(!showWriteReview);
        };
        return (
            <>
                <Formik
                    validationSchema={schema}
                    a
                    onSubmit={handleSubmit}
                    initialValues={{
                        review: ''
                    }}
                >
                    {({ handleSubmit, handleChange, values, touched, isValid, errors }) => (
                        <Form noValidate onSubmit={handleSubmit} className="review-form">
                            <div>
                                <Form.Group controlId="review" className="frmgrp post-review mb-3">
                                    <Rating onClick={handleRating} ratingValue={rating} /* Available Props */ />
                                    <Form.Control
                                        type="text"
                                        as="textarea"
                                        rows={6}
                                        maxLength="200"
                                        name="review"
                                        isInvalid={!!errors.review}
                                        value={values.review}
                                        onChange={handleChange}
                                        isValid={touched.review && !errors.review}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.review}</Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <Button type="submit" className="my-3">
                                Post Review
                            </Button>
                        </Form>
                    )}
                </Formik>
            </>
        );
    };

    return (
        <>
            <Row className="mb-4" style={{ maxWidth: '100%' }}>
                <Col xs={12} md={12} lg={6} className="">
                    <h3 className="mb-5">DESCRIPTION</h3>
                    <div>
                        <p>{course && course.description}</p>
                    </div>
                </Col>
                <Col xs={12} md={12} lg={6} className="subject-ta ps-2">
                    <h3 className="mb-5">REVIEWS</h3>
                    <div className="reviews-border">
                        {showWriteReview ? (
                            <Reviews />
                        ) : (
                            <>
                                <div className="d-flex justify-content-between">
                                    {/* <Rating onClick={handleRating} ratingValue={rating} /> */}
                                    <p>{allReviews && allReviews.length + ' Reviews'} </p>
                                    <Button className="review globl" disabled={!paidCourse} onClick={() => (paidCourse ? setShowWriteReview(!showWriteReview) : null)}>
                                        Write Review
                                    </Button>
                                </div>
                                {allReviews &&
                                    allReviews.sort().map((review) => {
                                        return (
                                            <>
                                                <div className="writtenreivews d-flex my-2">
                                                    <div>
                                                        <img src="../assets/user.png" alt="user" className="me-2" />
                                                    </div>
                                                    <div>
                                                        <p className="dated">{review.createdAt.substring(0, 10)}</p>
                                                        <p>{review.review}</p>
                                                        <Rating readonly initialValue="0" ratingValue={review.rating} />
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })}
                            </>
                        )}
                    </div>
                </Col>
            </Row>
            <Row className="m-0" style={{ maxWidth: '100%' }}></Row>
        </>
    );
};

export default CourseInfo;
